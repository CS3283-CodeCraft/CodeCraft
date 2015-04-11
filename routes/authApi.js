var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/openid',
	passport.authenticate('openid', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	}
);

router.get('/openid/return',
	passport.authenticate('openid', { failureRedirect: '/login' }),
	function(req, res) {
		console.log(req.user);
		res.render('openidReturn', {username: req.user.username});
	}
);

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

module.exports = router;
