/**
 * 
 * @authors eric phung (esphung@gmail.com)
 * @date    2017-11-05 00:42:23
 * @version 1.0.0
 */

/* simple json db */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


class User {
	constructor(user_id,username,phone,contacts,image_url) {
		this.user_id = user_id
		this.username = username
		if (phone != null && (phone.length == 10)) {
			this.phone = phone
		} else {
			this.phone = 0
		}
		if (contacts != null) {
			this.contacts = contacts
		} else {
			this.contacts = []
		}
		if (image_url != null){
			this.image_url = image_url
		} else {
			this.image_url = ""
		}

		console.log("Created New User Class Object")
		console.log(this);
	}// end constructor

}// end class def

// user check db for duplicate existing user record
User.prototype.isDuplicate = function() {
	// check db for exisiting duplicates
	for (key in global.users) {
		if (global.users[key]['username'] === this.username) {
			// duplicate record exists already
			return true;
		}// end if
	}// end for
	return false;
	console.log("Hello");
};

// export class module
module.exports = User

