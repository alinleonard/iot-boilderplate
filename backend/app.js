// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// Mail
// var nodemailer = require('nodemailer');
// Auth
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var bcrypt = require('bcrypt-nodejs');
// var async = require('async');
// var crypto = require('crypto');

// =================================================================
// routes ==========================================================
// =================================================================
var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

//Connect to MongoDB
var MongoURI = process.env.MONGO_URI || 'mongodb://localhost/node-superhero';
mongoose.connect(MongoURI , { useMongoClient: true } , function(err, res){
  if(res){
    console.log("Mongodb res: ", res.host);
  }
  if(err) {
    console.log('Error connect to: ' + MongoURI + '.' + err);
  } else {
    console.log('MongoDB connected successfully to ' + MongoURI);
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(session({
  secret: 'my app secret key', // help crypt sessions
  resave: true, // updates session on each page view even if it did not change
  saveUninitialized: false // sessions are not stored if they are empty
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/User');

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/', routes);
app.use('/', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
