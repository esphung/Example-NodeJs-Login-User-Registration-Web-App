/*
* @Author: eric phung
* @Date:   2017-11-18 18:40:15
* @Last Modified 2017-11-19
* @Last Modified time: 2017-11-19 00:46:16
*/

// simple json database
/*const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
*/

var bcrypt = require('bcryptjs');

class User {
	constructor(user_id, email, username, password, phone, image_url) {
		this.user_id = user_id
		this.username = username
		this.email = email
		this.password = password
		this.phone = phone
		this.contact_ids = []
		this.image_url = image_url
	}// end constructor

}// end class def

// export class
module.exports = User

/*module.exports.getUserByUsername = function(username, callback){
	var query = {username: username}
	//User.findOne(query, callback);
	var user = global.users.find(query).valueOf()
	//console.dir(user);
	return user
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}*/