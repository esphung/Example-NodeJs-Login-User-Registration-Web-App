/*
* @Author: eric phung
* @Date:   2017-11-18 10:13:07
* @Last Modified 2017-11-19
* @Last Modified time: 2017-11-19 01:12:05
* @Purpose:	"entry point for web appand api and routing"
* @Notes: https://www.youtube.com/watch?v=Z1ktxiqyiLA
*/

var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// set up routes
var routes = require('./routes/index');
var users = require('./routes/users');

var validator = require('validator');
// simple json database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Init
var app = express();// the main app

// custom classes
var Wrapper = require('./wrapper.js')
var User = require('./models/user.js')

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
global.users = db.get('users')

// ====================================================

// View Engine
app.set('views', path.join(__dirname,'/views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
//app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Statice Folder
app.use(express.static(path.join(__dirname, '/public')));

// Set Up Port 
app.set('port', (process.env.PORT || 5000));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

// ====================================================
// debug return all db records
app.get('/db', function (req,res) {
	res.send(global.users.valueOf())
})
/*app.get('/', function (req, res) {
	defaults();
	res.render('pages/index.ejs', {})
})*/

// GET USER REQUEST | FIND USER BY USERNAME
app.get('/api', function(req, res) {

	//console.dir(req.query);

	var user = global.users.find(req.query)
	var contacts = []
	// get all contacts from contact ids
	for (item in user.valueOf().contact_ids) {
		if (user.valueOf().contact_ids.hasOwnProperty(item)) {
			contacts.push(db.get('users['+ item +']').valueOf())
		}
	}

	var wrapped = new Wrapper(true,"Found User Record",user,contacts.valueOf())
	res.send(wrapped)

/*		// couldn't find user
		var wrapped = new Wrapper(false,"Couldn't Find User Record")
		res.send(wrapped)
*/
})

// POST REQUEST | INSERT USER BY USERNAME
app.post('/api', function(req, res) {
	defaults()


	// default vars
	var username;
	var email;
	var phone;
	var image_url;
	
	// SANITIZE AND VALIDATE USERNAME
	if (req.query.username != null) {
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
	}

	// SANITIZE AND VALIDATE EMAIL
	if (req.query.email != null) {
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
	}

	if (req.query.phone != null) {
		// SANITIZE AND VALIDATE PHONE
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
	}


	if (req.query.image_url != null) {
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
	}

	// create new user object
	var user = new User(
		(db.get('users').size() + 1),
		email,
		username,
		req.query.password,
		phone,
		image_url
	)

	// insert user object to db
	global.users.push(user).write()

	// return inserted results
	var wrapped = new Wrapper(true,"Inserted Record",
		[db.get('users.'+ (db.get('users').size() - (1)))])
	res.send(wrapped)

})// end insert user record

// DELETE REQUEST | REMOVE USER RECORD BY USERNAME
app.delete('/api', function (req, res) {
		db.get('users')
		.remove(req.query)
		.write()
		var wrapped = new Wrapper(true,"Deleted Record")
		res.send(wrapped)
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


