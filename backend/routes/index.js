var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/sign-in');
  }
  else {
    res.render('index', { title: 'Express', user: req.user });
  }

});

module.exports = router;