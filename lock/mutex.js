"use strict";const Promise=require("bluebird");class Mutex{constructor(){this.counter=0,this.waitingPromises=[]}lock(){return 1==++this.counter?Promise.resolve():new Promise(s=>{this.waitingPromises.push(s)})}release(){let s=this.waitingPromises.shift();s&&s(),this.counter=this.counter>0?--this.counter:0}}module.exports=Mutex;