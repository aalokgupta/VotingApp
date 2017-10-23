'use strict';

var signupButton = document.querySelector('.btn-signup') || null;
var loginButton = document.querySelector('.btn-login') || null;



signupButton.addEventListener('click', function(){
  console.log("signUp button Click");
  $.GET('/signup', function(req, res){

  });
});

loginButton.addEventListener('click', function(){
  console.log("Login button click");
});
