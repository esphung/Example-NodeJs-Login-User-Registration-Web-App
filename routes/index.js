/*
* @Author: eric phung
* @Date:   2017-11-18 18:22:10
* @Last Modified 2017-11-18
* @Last Modified time: 2017-11-18 19:13:20
*/

var express = require('express');
var router = express.Router();

// my test page
router.get('/', function (req, res) {
	res.render('index')
})

/*// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

*/
module.exports = router;