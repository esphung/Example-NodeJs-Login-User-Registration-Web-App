/*
* @Author: eric phung
* @Date:   2017-11-18 10:13:07
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 13:00:14
* @Purpose:	"entry point for web appand api and routing"
*/

var express = require('express');
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

// API URI CALL TO GET USER BY ID NUMBER
app.get('/users/:user_id', function(req, res) {
		res.send(
			db.get('users['+req.params.user_id+']')
  		.value())
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
		var wrapped = new Wrapper(true,"Found User Record",[user])
		res.send(wrapped)
	} else {
		// couldn't find user
		var wrapped = new Wrapper(false,"Couldn't Find User Record",[])
		res.send(wrapped)
	}
})

// POST REQUEST | INSERT USER BY USERNAME
app.post('/users', function(req, res) {
	defaults()

	// create new user object
	var user = new User(
		(db.get('users').size() + 2), 
		req.query.username,
		req.query.phone,
		req.query.contacts
		)

	// check for duplicates
	if (user.isDuplicate() == true) {
		// duplicate record exists
		var user = db.get('users').find(req.query)
		var wrapped = new Wrapper(false,"Record Already Exists",[user])
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
		var wrapped = new Wrapper(true,"Deleted Record",[])
		res.send(wrapped)
	} else {
		// user record does not already exist
		var wrapped = new Wrapper(true,"Record Doesnt Exist",[])
		res.send(wrapped)
	}

});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


