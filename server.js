var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

var app = express();
require('dotenv').load();

mongoose.connect('mongodb://localhost:27017/votingapp');
console.log(process.env.API_KEY);
passport.use(new Strategy({
          consumerKey: process.env.API_KEY,
          consumerSecret: process.env.API_SECRET,
          callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, cb){
          User.findOrCreate({ twitterId: profile.id}, function(err, user){
            return cb(err, user);
          })
        }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session())

app.route('/').get(function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
});

app.route('/auth/twitter').get(passport.authenticate('twitter'));

app.route('/auth/twitter/callback').get(passport.authenticate('twitter',
                                      {failureRedirect: '/login'}),
                                      function(req, res){
                                        res.redirect('/');
                                      });


console.log(process.cwd() + '/app/controllers');
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

var port = 8080;
app.listen(port, function(){
  console.log("Listening on port no "+ port + "...");
});
