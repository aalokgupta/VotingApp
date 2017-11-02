'use strict';

(function(){
  var loginButton = document.querySelector('.btn-login') || null;
  loginButton.addEventListener('click', function(){
    console.log("Login button click");
  });

  var submitPoll = document.querySelector('#id_btn_submit_poll') || null;
  if(submitPoll === null){
    console.log("submitPoll value is null");
  }
  submitPoll.addEventListener('click', function(){
    console.log("submit poll has been clicked");
  });
})();
