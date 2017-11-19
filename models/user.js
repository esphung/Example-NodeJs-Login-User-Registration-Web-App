/*
* @Author: eric phung
* @Date:   2017-11-18 18:40:15
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 23:01:13
*/
/**
 * 
 * @authors eric phung (esphung@gmail.com)
 * @date    2017-11-05 00:42:23
 * @version 1.0.0
 */

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

