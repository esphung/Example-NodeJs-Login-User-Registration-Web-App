//https://www.youtube.com/watch?v=mdK-2ga3vqA
/**
 * 
 * @authors eric phung (esphung@gmail.com)
 * @date    2017-11-05 00:42:23
 * @version $Id$
 */

var express = require('express');
var app = express();// the main app
var admin = express(); // the sub app

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

function defaults () {
	// Set some defaults
	console.log("Defaults reset");
	db.defaults({ users: [] })
	.write()
}

app.locals.title = 'Plug'
// => 'My App'
app.locals.email = 'esphung@gmail.com'
// => 'me@myapp.com'

global.users = db.get('users').value()



app.use(express.static(__dirname + '/public'));
app.use('/admin', admin); // mount the sub app

app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// admin sub app
app.get('/', function (req, res) {
	defaults();
	console.log(admin.mountpath); // /admin
	res.render('pages/index', {
		title: " Admin",
		next: { link: "/db",icon:'glyphicon glyphicon-cloud',label: " Database"}
	})
})

// tests
// custom user class
var User = require('./user')

// get user by handle
app.get('/db', function(req, res) {
	console.log(app.users)
	res.redirect('/');
})

// get user by handle
app.get('/users', function(req, res) {
	res.send(db.get('users').find({
		handle:req.query.handle
	})
	)
})

// insert a user by handle
app.post('/users', function(req, res) {
	defaults()

	// create new user
	var user = new User((db.get('users').size() + 1), 
		req.query.handle,
		req.query.fname,
		req.query.lname
		)
	console.log(user.handle)

	for (key in global.users) {
		console.log(global.users[key].handle)
		console.log(global.users[key].handle.localeCompare(user.handle));

		if (global.users[key].handle.localeCompare(user.handle) == 0) {
			// zero is the difference factor between two strings
			console.log('User already exists :(')
			res.send("User already exists")
			return
		}
	}// end for each loop
	
	// insert user to db
	db.get('users')
	.push(user)
	.write()

	// return inserted results
	res.send(
		db.get('users.'+
			(db.get('users')
				.size() - (1)
				)))
})

/*// api
app.get('/users/:id/:handle*', function (req, res) {
	if (db.get(('users.')+(req.params.handle)) != null)
		res.send(db.get(('users.')+(req.params.id)))
		//res.send(req.params)
})*/

app.delete('/users', function (req, res) {
	db.get('users')
	.remove({
		handle: req.query.handle })
	.write()
	console.log(req.query)
	res.send('DELETE request to users succesful!');
});



app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


