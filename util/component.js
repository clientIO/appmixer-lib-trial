"use strict";const metrohash128=require("metrohash").metrohash128,objectUtil=require("./object");function identity(t){return t}function getPropertyByPath(t,e){return objectUtil.getByPath(e,t,".")}function createMappingFunctionFromCSV(t){return t=Array.isArray(t)?t:t.split(","),e=>{const n={},o=[];for(let r of t){"-"==(r=r.trim())[0]?(r=r.substr(1),o.push(r)):objectUtil.setByPath(n,r,objectUtil.getByPath(e,r,"."),".")}for(let t of o)objectUtil.deleteAtPath(n,t,".");return n}}function checkListForChanges(t,e,n,o={}){if("string"==typeof n)n=getPropertyByPath.bind(null,n);else if("function"!=typeof n)throw new TypeError(`'idMapping' should be type of 'function' or 'string' but is of '${typeof n}'!`);let r=!0;Array.isArray(e)&&(e=new Map(e),r=!1);const{includeOldData:i=!1,mappingFunction:a=identity,stringifyFunction:s=JSON.stringify.bind(JSON),hashFn:c=metrohash128}=o;let h=[],u=new Map;for(let o of t){const t=n(o),r=a(o),l=c(s(r));u.set(t,{hash:l,data:i?r:void 0});let p=e.get(t);p?p.hash===l?e.delete(t):(h.push({item:o,oldItem:p.data}),e.delete(t)):h.push({item:o,oldItem:null})}return{changes:h=h.concat([...e.values()].map(t=>({item:null,oldItem:t.data}))),newState:r?u:[...u]}}module.exports={checkListForChanges:checkListForChanges,createMappingFunctionFromCSV:createMappingFunctionFromCSV};