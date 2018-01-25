"use strict";var RouteConfig=require("./RouteConfig"),RouterMap=function(){this.routesMap={},this.onRouteConfigCreated=null};module.exports.RouterMap=RouterMap,RouterMap.prototype.initialize=function(o){if("object"!=typeof o)throw new Error("Bad type of RouterMap configuration");var t;this.onRouteConfigCreated=o.onRouteConfigCreated,this.configuration=o.routes;var e="function"==typeof this.onRouteConfigCreated;for(let o in this.configuration)if(this.configuration.hasOwnProperty(o)){t=this.configuration[o];var i=new RouteConfig(o,t);e&&this.onRouteConfigCreated(i),this.routesMap[o]=i}},RouterMap.prototype.getRouteJson=function(o,t){var e=this.routesMap[o];return e?e.getJson(t):null};