/*
* @Author: eric phung
* @Date:   2017-11-18 18:22:00
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 23:09:37
*/
/* simple json db */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Register
router.get('/register', function (req,res) {
	res.render('register')
})

// Login
router.get('/login', function (req,res) {
	res.render('login')
})

// Register User
// (user_id, email, username, phone, contact_ids, image_url)
router.post('/register', function (req,res) {
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var username = req.body.username;
	var phone = req.body.phone;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('fname', 'First Name is required').notEmpty();
	req.checkBody('lname', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		// errors in user input
		res.render('register', {
			errors: errors
		})
	} else {

		// create new user object
		var user = new User(
			(global.users.size() + 1),
			email,
			username,
			password,
			phone,
			req.query.contact_ids,
			""
		)

		// insert user object to db
		global.users
		.push(user)
		.write()
		
		res.send(req.body)
	}

})

module.exports = router;


/*
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

*/
