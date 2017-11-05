var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session =  require('express-session');
var User = require('./app/model/users.js');
var bodyParser = require('body-parser');
var Url = require('url');

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var RequestHandler = require(process.cwd() + '/app/controllers/RequestHandler.server.js');
var viewPollHandler = require(process.cwd() + '/app/controllers/Controller.viewpoll.server.js');

var clickhandler = new ClickHandler();

var app = express();
require('dotenv').load();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()) // used for parsing the request header of post method without this req will be undefined)



function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		else{
			res.redirect('/');
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

app.route('/submit_poll').post(clickhandler.userPoll);
// function(req, res){
// 	console.log("post submit poll " +req.body.poll_string);
// 	console.log("post submit poll " +req.body.option);
//   console.log("post submit poll " +req.body);
// 	res.sendStatus(200);
// });

app.route('/view_poll/:poll_string').get(function(req, res){

	console.log("poll_string "+ JSON.stringify(Url.parse(req.url)));
	var req_url = decodeURI(Url.format(Url.parse(req.url))) || null;
	req_url = req_url.substr("/view_poll/".length, req_url.length);
	console.log("inside view_poll"+ req_url);
	viewPollHandler(req_url, function(err, html){
				if(err){
					res.send("Not Found");
				}
				// console.log("html return "+html);
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': html.length,
					'Expires': new Date().toUTCString()
				});
				res.end(html);
		});

});


app.route('/login').get(function(req, res){
  res.sendFile(process.cwd() + '/public/login.html');
});

app.route('/logout').get(function(req, res){
	req.logout();
	res.redirect('/');
});


app.route('/username').get(isLoggedIn, function(req, res){
		console.log("request for user name "+req.user.twitter.displayName);
		res.send(JSON.stringify({"username":req.user.twitter.displayName}));
});

app.route('/create-poll').get(isLoggedIn, function(req, res){
  res.sendFile(process.cwd() + '/public/create_poll.html');
  console.log("req = "+req.user.twitter.id);
  console.log("req = "+req.user.twitter.displayName);
  //var user_name = req.profile.username;
  //console.log("user_name = "+user_name);
});

app.route('/publish-poll').get(isLoggedIn, function(req, res){

	console.log("inside publish-poll "+JSON.stringify(req.body));
	console.log("inside publish-poll "+req);
	// console.log("inside publish-poll "+req.body[0].poll_url);
	console.log("poll has been published");
	res.sendStatus(200);
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

app.route('/:username/:poll_url').get(function(req, res){
	// console.log("app_url = "+req.params.poll_url);
	// var username = req.params.username;
	// console.log("app_url = "+req.params.username);
	// console.log("app_url = "+JSON.stringify(req.params));
	var req_url = decodeURI(Url.format(Url.parse(req.url))) || null;
	req_url = req_url.substr(req.params.username.length + 2, req_url.length); //removing /username/ (+2 for two slash)
	// console.log("inside /:username/:poll_url  "+req_url);

	RequestHandler(req_url, function(err, html){
				if(err){
					res.send("Not Found");
				}
				// console.log("html return "+html);
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': html.length,
					'Expires': new Date().toUTCString()
				});
				res.end(html);
		});
});


var port = 8080;
app.listen(port, function(){
  console.log("Listening on port no "+ port + "...");
});
