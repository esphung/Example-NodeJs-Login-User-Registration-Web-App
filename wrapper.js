/*
* @Author: eric phung
* @Date:   2017-11-18 10:11:11
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 13:44:54
* @Purpose : "Blueprint Class for wrapping any and all http requests" 
*/

class Wrapper {
  constructor(success, msg, user, contacts) {
    this.success 		= success;
    this.msg 			= msg;
    this.user           = user;
    this.contacts       = contacts;
  }
}// end class def

// export class
module.exports = Wrapper