/**
 * 
 * @authors eric phung (esphung@gmail.com)
 * @date    2017-11-05 00:42:23
 * @purpose	entry point for web appand api and routing
 * @version $Id$
 */

var express = require('express');
var app = express();// the main app
var admin = express(); // the sub app


/* temporary simple json database */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// custom user class
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
	console.log(admin.mountpath); // /admin
	res.render('pages/index.ejs', {})
})

// GET USER REQUEST | FIND USER BY USERNAME
app.get('/users', function(req, res) {
		// check for duplicate existing user record
	var user = new User(
		// create new user object
		(db.get('users').size() + 1), 
		req.query.username,
		req.query.fname,
		req.query.lname,
		req.query.phone,
		req.query.contacts
	)

	// check for existing record
	if (user.isDuplicate() == true) {
		user = db.get('users').find(req.query)
		res.send(user)
		return user
	} else {
		// could find user
		res.send("User couldn't be found")
	}
})

// POST REQUEST | INSERT USER BY USERNAME
app.post('/users', function(req, res) {
	defaults()

	// create new user object
	var user = new User(
		(db.get('users').size() + 1), 
		req.query.username,
		req.query.fname,
		req.query.lname,
		req.query.phone,
		req.query.contacts
		)

	// check for duplicate existing record
	if (user.isDuplicate() == true) {
		console.log("Existing Record Found");
		res.send("User already exists")
	} else {
		// insert user object to db
		db.get('users')
		.push(user)
		.write()

		// return inserted results
		res.send(
			db.get('users.'+
				(db.get('users')
					.size() - (1)
					)))
		console.log(user)		
	}
	

})// end insert user record


// DELETE REQUEST | REMOVE USER RECORD BY USERNAME
app.delete('/users', function (req, res) {
	
	// check for duplicate existing user record
	var user = new User(
		// create new user object
		(db.get('users').size() + 1), 
		req.query.username,
		req.query.fname,
		req.query.lname,
		req.query.phone,
		req.query.contacts
	)

	if (user.isDuplicate() == true) {
		// user record already exists, write to db
		db.get('users')
		.remove({
			username: req.query.username })
		.write()
		res.send('Deleted: ' +  req.query.username)
	} else {
		// user record does not already exist
		console.log("User does not exist, yet")
		res.send("User does not exist, yet")
	}

});




app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


