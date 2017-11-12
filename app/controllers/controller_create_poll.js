'use strict';
var static_id = 3;

(function(){
  var create_poll_btn = document.querySelector("#btn-create-poll") || null;
  var username = document.querySelector("#id_user_name") || null;
  var poll_text = document.querySelector("#id-poll-text") || null;
  var add_option = document.querySelector("#add-option");
  var ol_option = document.querySelector("#ol-option");
  var poll_option1 = document.querySelector("#id-poll-option1") || null;
  var poll_option2 = document.querySelector("#id-poll-option2") || null;
  var poll_option3;
  var poll_option4;
  var json_obj = [];
  var apiUrl = "http://127.0.0.1:8080" + '/api/:id/auth';
  var publish_poll_url = "http://127.0.0.1:8080" + '/publish-poll';

  function displayUserName(data){

    var obj = JSON.parse(data);
    if(obj !== undefined){
        username.innerHTML = obj["username"];
    }
    else{
      username.innerHTML = "Guest";
    }
  }

  $(function(){
    var url = "http://127.0.0.1:8080/username";
    ajaxFunctions.ajaxRequest("GET", url, {}, displayUserName);
  });

  function publishPoll(data){
    console.log("server responded "+data);
    console.log("after saving of poll, server responded with "+JSON.parse(data).poll_url);
      var poll_url = JSON.parse(data).poll_url;
      var body = document.querySelector('.create_poll_container') || null;
      while (body.firstChild) {
          body.removeChild(body.firstChild);
      }

      if(body === null){
        console.log("div_server_generated_link is null");
      }
      else{
        var h2 = document.createElement('h2');
        var linkText = document.createTextNode("Poll has been publish, click the given link to see the status ");
        h2.appendChild(linkText);
        var a = document.createElement('a');
        var link = document.createTextNode(poll_url);
        a.appendChild(link);
      	a.href = poll_url  ;
      	body.appendChild(h2).appendChild(a);
      }
  }

  function prepare_poll_josn(no_of_list_item){

    if(poll_text.value === ""){
      alert("please provide poll string");
      return false;
    }
    else{
      json_obj.push({"poll_string" : poll_text.value});
    }
    var json = {};
    for(var i = 1; i <= no_of_list_item; i++){
      var poll_id = "li #id-poll-option" + i;
      console.log("poll id = "+poll_id);
      var poll_options = $(poll_id).val() || null;
      if(poll_options === ""){
         alert("please provide string for the option"+i);
         return false;
      }
      else{
          json = {["poll_option" + i]: poll_options};
          json_obj.push(json);
       }
    }

    console.log("poll string are "+ JSON.stringify(json_obj));

  //  if(poll_option1.value === ""){
  //     alert("please provide option1 string");
  //     return false;
  //  }
  //  else{
  //     json_obj.push({"poll_option1": poll_option1.value});
  //   }
   //
  //   if(poll_option2.value === ""){
  //     alert("please provide option2 string");
  //     return false;
  //   }
  //   else{
  //     json_obj.push({"poll_option2": poll_option2.value});
  //   }
   //
  //   if(static_id > 3 && poll_option3.value === ""){
  //     alert("please provide option3 string");
  //     return false;
  //   }
  //   else if(static_id > 3){
  //     json_obj.push({"poll_option3": poll_option3.value});
  //   }
   //
  //   if(static_id > 4 && poll_option4.value === ""){
  //     alert("please provide option4 string");
  //     return false;
  //   }
  //   else if(static_id > 4){
  //     json_obj.push({"poll_option4": poll_option4.value});
  //   }
     return true;
  }

  create_poll_btn.addEventListener('click', function () {
    var no_of_list_item = $("#ol-option li").length;
    console.log("No of option available are "+no_of_list_item);

        if(true === prepare_poll_josn(no_of_list_item)){
          console.log(JSON.stringify(json_obj));
          ajaxFunctions.ajaxRequest('POST', apiUrl, json_obj, publishPoll);
        }
     }, false);

  add_option.addEventListener('click', function(){
    // if(static_id < 5){
      var li = document.createElement("li");
      var input = document.createElement("input");
      input.type = "text";
      input.className = "div-poll-option";
      input.setAttribute("id", "id-poll-option" + static_id);
      li.appendChild(input);
      ol_option.appendChild(li);
      static_id++;
      // console.log("id = "+static_id);
      // if(static_id === 4){
      //    poll_option3 = document.querySelector("#id-poll-option3") || null;
      // }
      // if(static_id === 5){
      //   poll_option4 = document.querySelector("#id-poll-option4") || null;
      // }
  //   }
  //   else{
  //     alert("Max 4 options are allowd for a poll");
  // }
  }, false);
})();
