"use strict";const check=require("check-types");module.exports.setByPath=function(e,t,r,a){check.assert.object(e,"Invalid obj param."),check.assert.string(t,"Invalid path param."),a=a||"/";var c=(t=(t=(t=t.replace(/\.\[/g,a)).replace(/\[/g,a)).replace(/\]/g,"")).split(a),l=e,p=0;if(t.indexOf(a)>-1){for(var s=c.length;p<s-1;p++)l=l[c[p]]||(l[c[p]]={});l[c[s-1]]=r}else e[t]=r;return e},module.exports.getByPath=function(e,t,r){check.assert.object(e,"Invalid obj param."),check.assert.string(t,"Invalid path param."),r=r||"/";for(var a,c=(t=(t=(t=t.replace(/\.\[/g,r)).replace(/\[/g,r)).replace(/\]/g,"")).split(r);c.length;){if(a=c.shift(),!(Object(e)===e&&a in e))return;e=e[a]}return e},module.exports.deleteAtPath=function(e,t,r){check.assert.object(e,"Invalid obj param."),check.assert.string(t,"Invalid path param."),r=r||"/";let a=e,c=(t=(t=(t=(t=t.replace(/\.\[/g,r)).replace(/\[/g,r)).replace(/\]/g,"")).split(r))[0],l=!0;for(let e=0;e<t.length-1;e++){if(c=t[e],"object"!=typeof a){l=!1;break}a=a[c]}return l&&(c=t.pop(),Array.isArray(a)?a.splice(c,1):"object"==typeof a&&delete a[c]),e};