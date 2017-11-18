/*
* @Author: eric phung
* @Date:   2017-11-18 10:13:07
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 15:57:50
* @Purpose:	"entry point for web appand api and routing"
*/

var express = require('express');
var validator = require('validator');
var app = express();// the main app

/* temporary simple json database */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// custom classes
var Wrapper = require('./wrapper.js')
var User = require('./user.js')

// resets db.json file
function defaults () {
	// Set some defaults
	console.log("Defaults reset");
	db.defaults({ users: [] })
	.write()
}

// metadata variables
app.locals.title = 'Plug App'
// => 'My App'
app.locals.email = 'esphung@gmail.com'
// => 'me@myapp.com'

// global app variables
global.users = db.get('users').value()


app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	defaults();
	res.render('pages/index.ejs', {})
})

// GET USER REQUEST | FIND USER BY USERNAME
app.get('/users', function(req, res) {


	console.log(validator.isEmail(req.query.email));
	
	var user = new User(
		// create new user object
		(db.get('users').size() + 1),
		req.query.email,
		req.query.username,
		req.query.phone,
		req.query.contact_ids
	)

	// check for existing record
	if (user.isDuplicate() == true) {
		var user = db.get('users').find(req.query)


		var contacts = []
		// get all contacts from contact ids
		for (item in user.valueOf().contact_ids) {
			if (user.valueOf().contact_ids.hasOwnProperty(item)) {
				contacts.push(db.get('users['+ item +']').valueOf())
			}

		}

		var wrapped = new Wrapper(true,"Found User Record",user,contacts.valueOf())
		res.send(wrapped)
	} else {
		// couldn't find user
		var wrapped = new Wrapper(false,"Couldn't Find User Record")
		res.send(wrapped)
	}
})

// POST REQUEST | INSERT USER BY USERNAME
app.post('/users', function(req, res) {
	defaults()

	// default vars
	var username;
	var email;
	var phone;
	var image_url
	
	// SANITIZE VALIDATE USERNAME
	var username_input = validator.blacklist(req.query.username, '\!\?\+\*\^\$')
	username_input = validator.escape(username_input)
	username_input = validator.ltrim(username_input, "\s")
	username_input = validator.rtrim(username_input, "\s")
	if (validator.isAlphanumeric(username_input)) {
		// valid username
		username = username_input
	} else {
		// username is not valid
		var wrapped = new Wrapper(false,"Username Not Valid")
		res.send(wrapped)
		return
	}// end validate username

	// SANITIZE VALIDATE EMAIL
	var email_input = req.query.email
	var email_input = validator.blacklist(email_input, '\!\?\+\*\^\$')
	email_input = validator.escape(email_input)
	email_input = validator.ltrim(email_input, "\s")
	email_input = validator.rtrim(email_input, "\s")

	if (validator.isEmail(email_input)) {
		// email is valid
		email = email_input
	} else {
		// email not valid
		var wrapped = new Wrapper(false,"Email Not Valid")
		res.send(wrapped)
		return
	}

	// SANITIZE VALIDATE PHONE (AND CONVERT TO INTEGER?)
	var phone_input = req.query.phone
	var email_input = validator.blacklist(phone_input, '\!\?\+\*\^\$')
	phone_input = validator.escape(phone_input)
	phone_input = validator.ltrim(phone_input, "\s")
	phone_input = validator.rtrim(phone_input, "\s")
	if (validator.isMobilePhone(phone_input, 'en-US')) {
		// is valid phone
		phone = phone_input
	} else {
		// phone not valid
		var wrapped = new Wrapper(false,"Phone Not Valid")
		res.send(wrapped)
		return
	}

	// VALIDATE IMAGE URL
	if (validator.isURL(
		validator.ltrim(
			validator.rtrim(req.query.image_url,"\s"), "\s"))) {
		// valid url
		image_url = req.query.image_url
	} else {
		// not valid url
		var wrapped = new Wrapper(false,"Image Url Not Valid")
		res.send(wrapped)
		return
	}

	// create new user object
	var user = new User(
		(db.get('users').size() + 3),
		email,
		username,
		phone,
		req.query.contact_ids,
		image_url
	)

	// check for duplicates
	if (user.isDuplicate() == true) {
		// duplicate record exists
		var user = db.get('users').find(req.query)
		var wrapped = new Wrapper(false,"Record Already Exists",user)
		res.send(wrapped)

	} else {

		// insert user object to db
		db.get('users')
		.push(user)
		.write()

		// return inserted results
		var wrapped = new Wrapper(true,"Inserted Record",
			[db.get('users.'+ (db.get('users').size() - (1)))])
		res.send(wrapped)
	}

})// end insert user record

// DELETE REQUEST | REMOVE USER RECORD BY USERNAME
app.delete('/users', function (req, res) {
	
	// check for duplicate existing user record
	var user = new User(
		// create new user object
		(db.get('users').size() + 1),
		req.query.email,
		req.query.username,
		req.query.phone,
		req.query.contact_ids
	)

	if (user.isDuplicate() == true) {
		// user record already exists, write to db
		db.get('users')
		.remove({
			username: req.query.username })
		.write()
		var wrapped = new Wrapper(true,"Deleted Record")
		res.send(wrapped)

	} else {
		// user record does not already exist
		var wrapped = new Wrapper(false,"Record Doesnt Exist")
		res.send(wrapped)
	}

	
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


