"use strict";const request=require("request"),Promise=require("bluebird"),RouterMap=require("./RouterMap").RouterMap,fs=require("fs"),url=require("url");var out={info:console.log,error:console.log};function safeCallback(e,o){"function"==typeof e&&e(o.error,o.body,o.statusCode)}function processError(e,o,t){if(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}if("string"==typeof t)try{t=JSON.parse(t)}catch(e){return null}return"object"==typeof t&&t.error?t:null}function processResponse(e,o,t){(e=processError(e,o,t))&&(t=null);var r={error:e,body:t};return o&&o.statusCode&&(r.statusCode=o.statusCode),r}function loadLocalRoutesConfiguration(e){try{var o=fs.readFileSync(e,"utf8");return JSON.parse(o)}catch(o){return out.error("Routes configuration file error: "+e+"\n"+o.message),null}}function basicTransformResponseBody(e){return JSON.parse(e)}var ApiDriver=function(e){switch(typeof(e=e||{}).routesConfiguration){case"string":e.routesConfiguration=loadLocalRoutesConfiguration(e.routesConfiguration);break;case"object":break;default:throw new ReferenceError("Routes configuration file not defined")}switch(typeof e.customImplementationsModule){case"string":e.customImplementationsModule=require(e.customImplementationsModule);break;case"object":break;default:e.customImplementationsModule={}}e.verbose=!!e.verbose,"function"!=typeof e.transformResponseBody&&(e.transformResponseBody=basicTransformResponseBody),this.promSend=Promise.promisify(this.send,{context:this}),this.config=e,this.routesMap=new RouterMap,this.routesMap.initialize({onRouteConfigCreated:this.onRouteConfigCreated.bind(this),routes:e.routesConfiguration})};ApiDriver.prototype.createCustomFunction=function(e){var o=this.config.customImplementationsModule[e.rawConfig.customImplementation],t=Promise.promisify(o);if("function"!=typeof o)throw new Error("Couldn't find \""+e.rawConfig.customImplementation+'" in custom implementation module. Route: '+e.fullName);return function(r,n){r=r||{};var s=this.routesMap.getRouteJson(e.fullName,r);if("function"!=typeof n)return t(s,r);o(s,r,n)}.bind(this)},ApiDriver.prototype.createGeneratedFunction=function(e){return function(o,t){o=o||{};var r=this.routesMap.getRouteJson(e.fullName,o);if("function"!=typeof t)return this.promSend(e.fullName,r,o);this.send(e.fullName,r,o,t)}.bind(this)},ApiDriver.prototype.onRouteConfigCreated=function(e){for(var o,t=e.rawConfig.customImplementation?this.createCustomFunction(e):this.createGeneratedFunction(e),r=this,n=e.namespaceSequence,s=0;s<n.length;s++)r[o=n[s]]=r[o]||{},r=r[o];r[e.name]=t},ApiDriver.prototype.send=function(e,o,t,r){if(null==o)throw new Error("Unknown route!");if(!o.uri)throw new Error("Missing uri param for route "+e);if(!o.method)throw new Error("Missing method param for route "+e);var n={method:o.method,uri:this.config.baseUrl+o.uri,json:t.json,qs:o.qs||t.qs,formData:o.formData||t.formData,body:o.body||t.body,headers:o.headers,auth:o.auth};this.config.token&&(n.auth={bearer:this.config.token}),request(n,function(n,s,i){if(n||-1===[200,201,302].indexOf(s.statusCode))safeCallback(r,processResponse(n,s,i));else{if(302===s.statusCode&&s.headers.location){let n=url.parse(s.headers.location);return this.config.baseUrl=n.protocol+"//"+n.host,o.uri=n.path,this.send(e,o,t,r)}try{"string"==typeof i&&(i=this.config.transformResponseBody(i))}catch(e){return void safeCallback(r,processResponse(e,s,i))}var u=processResponse(n,s,i);safeCallback(r,u),this.config.verbose&&(out.info(e+" successfully done.\nsendParams:\t",JSON.stringify(t||{})),out.info("response code: "+s.statusCode),out.info(JSON.stringify(i,null,"\t")))}}.bind(this))},ApiDriver.prototype.setAccessToken=function(e){this.config.token=e},ApiDriver.prototype.setBaseUrl=function(e){this.config.baseUrl=e},module.exports=ApiDriver;