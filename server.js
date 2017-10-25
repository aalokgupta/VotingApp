var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session =  require('express-session');
var User = require('./app/model/users.js');

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var clickhandler = new ClickHandler();

var app = express();
require('dotenv').load();

function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		else{
			res.redirect('/login');
		}
	}

	console.log(process.cwd() + '/app/controllers');
	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
	app.use('/public', express.static(process.cwd() + '/public'));
	app.use('/common', express.static(process.cwd() + '/app/common'));

mongoose.connect('mongodb://localhost:27017/votingapp');

app.use(session({
  secret: 'voting app',
  resave: false,
  saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.route('/').get(function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
});

app.route('/login').get(function(req, res){
  res.sendFile(process.cwd() + '/public/login.html');
});

app.route('/create-poll').get(isLoggedIn, function(req, res){
  res.sendFile(process.cwd() + '/public/create_poll.html');

  console.log("req = "+req.user.twitter.id);
  console.log("req = "+req.user.twitter.displayName);
  //var user_name = req.profile.username;
  //console.log("user_name = "+user_name);
});

app.route('/publish-poll').get(isLoggedIn, function(req, res){
	res.sendFile(process.cwd() + '/public/publish-poll.html');
	console.log("poll has been published");
});

app.route('/api/:id/auth').post(isLoggedIn, clickhandler.createPoll);

app.route('/auth/twitter').get(passport.authenticate('twitter'));

app.route('/auth/twitter/callback').get(passport.authenticate('twitter',
                                      {failureRedirect: '/login'}),
                                      function(req, res){
                                        res.redirect('/create-poll');
                                      });


passport.use(new Strategy({
          consumerKey: process.env.API_KEY,
          consumerSecret: process.env.API_SECRET,
          callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, cb){
          process.nextTick(function(){
            User.findOne({'twitter.id': profile.id}, function(err, user){
              if(err){
                throw err;
              }
              if(user){
                  console.log("user already register"+profile.id + " Name = "+profile.displayName);
                  return cb(null, user);
              }
              else{
                var newuser = new User();
                newuser.twitter.id = profile.id;
                newuser.twitter.displayName = profile.displayName;
                newuser.twitter.userName = profile.userName;
                newuser.save(function(err){
                  if(err){
                    throw err;
                  }
                  console.log("New user insert successfull with twitter id = "+profile.id);
                  return cb(null, user);
                });
              }
            });
          });
      }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var port = 8080;
app.listen(port, function(){
  console.log("Listening on port no "+ port + "...");
});
