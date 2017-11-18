/*
* @Author: eric phung
* @Date:   2017-11-18 10:11:11
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 10:39:14
* @Purpose : "Blueprint Class for wrapping any and all http requests" 
*/

class Wrapper {
  constructor(success, msg, results) {
    this.success 		= success;
    this.msg 			= msg;
    this.count 			= results.length;

    if (this.count > 0) {
    	this.results 	= results;
    } else {
    	this.count 		= 0;
    	this.results 	= [];
    }

  }
}// end class def

// export class
module.exports = Wrapper