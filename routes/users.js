/*
* @Author: eric phung
* @Date:   2017-11-18 18:22:00
* @Last Modified 2017-11-19
* @Last Modified time: 2017-11-19 01:26:02
*/
/* simple json db */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

		// show success message
		req.flash('success_msg', 'You are now registered and can login')

		// redirect to new page
		res.redirect('/users/login')
	}

})

passport.use(new LocalStrategy(
	function(username, password, done) {

		// get user by username here
		var user = global.users.find({username:username})
		if (!user) {
			return done(null, false, {message: 'Unknown User'})
		}
		if ((user.valueOf().password) === password) {
			return done(null, user.valueOf())
		}
		else {
			return done(null, false, {message: 'Invalid Password'})
		}

}));

passport.serializeUser(function(user, done) {
	console.log('serializing user by user_id: ');
    console.log(user);
	done(null, user.valueOf().user_id);
});

passport.deserializeUser(function(id, done) {
	console.log('deserializing user by user_id: ');
    console.log('USER_ID: ',id);
    // get user by user_id
    var user = global.users.find({user_id: id})
    console.dir(user.valueOf());

	done(null, user)

});


router.post('/login',
	passport.authenticate('local', {successRedirect: '/', failureRedirect:'/users/login', failureFlash: true}), function (req,res) {
		res.redirect('/')
});

router.get('/logout', function(req, res){
	req.logout()

	req.flash('success_msg', 'You are logged out')

	res.redirect('/users/login')
});

module.exports = router;

