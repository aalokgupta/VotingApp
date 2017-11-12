'use strict';

var Poll = require('../model/poll.js');

function RequestHandler(poll_string, callback){

  console.log("req query = "+poll_string);

  Poll.findOne({'poll_string': poll_string}, {_id: false})
      .exec(function(err, document) {
        if(err){
          var html = '<html><body><h2>Requested Poll not found</h2></body></html>'
          return callback(null, html);
        }
  if(document){
    console.log("document fetched from db "+document);
    console.log("document fetched from db "+document.poll_string);
    var html =  buildHtml(document);
    // console.log("html length = "+html.length);
    // console.log(""+html);
    return callback(null, html);
  }
  else {
    var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
    return callback(null, html);
  }
});
};

function build_script(document){

  var ajax_function = 'function ajaxRequest(method, url, data) { ' +
                      'var xmlhttp = new XMLHttpRequest();' +
                      'xmlhttp.open(method, url, true);' +
                      'xmlhttp.setRequestHeader("Content-Type", "application/json");' +
                      'xmlhttp.onreadystatechange=function(){' +
                        'if (xmlhttp.readyState === 4 && xmlhttp.status === 200){' +
                          'string=xmlhttp.responseText;' +
                          'console.log("response from server "+string);' +
                          //  '(window.location.replace("http://127.0.0.1:8080/public/publish-poll.html"));' +
                          '}' +
                        '};'+
                        'xmlhttp.send(JSON.stringify(data)); ' +
                      '}'

  var submit_poll_script = '$("#id_btn_submit_poll").click(function(){' +
                              'var url = "http://127.0.0.1:8080/submit_poll"; ' +
                              'var json = {' +  "poll_string" + ':' + '\"' + document.poll_string + '\" '+',' + "option" + ':' + 'user_option' + '};' +
                              'ajaxRequest("POST", url, json)' +
                            '});'

  var view_poll_script = '$("#id_btn_view_poll").click(function(){' +
                            'var url = "http://127.0.0.1:8080/view_poll/' + document.poll_string  + '";' +
                            'console.log("view btn url "+url);'+
                            'var json = {};' +
                            'ajaxRequest("GET", encodeURI(url), json)' +
                          '});'

  var radio_btn_script  =  ' $("input[type=radio][name=options]").change(function() {' +
                                'if(this.value === "option1") user_option = 1;' +
                                'else if(this.value === "option2") user_option = 2;' +
                                'else if(this.value === "option3") user_option = 3;' +
                                'else if(this.value === "option4") user_option = 4;' +
                                'else if(this.value === "option5") user_option = 5;' +
                                'else if(this.value === "option6") user_option = 6;' +
                                'else if(this.value === "option7") user_option = 7;' +
                                'else if(this.value === "option8") user_option = 8;' +
                                'else if(this.value === "option9") user_option = 9;' +
                                'else if(this.value === "option10") user_option = 10;' +
                            '});'

  var script = '<script>' +
                  '$(function(){' +
                    'var user_option = 1;' +
                     ajax_function +
                     submit_poll_script +
                     radio_btn_script +
                  '});' +
                '</script>'
  return script;
}

function buildHtml(document){
  var script = build_script(document);
  var body =  '<div class = "create-poll-header">' +
                  '<div class = "">' +
                  '<h1 style = "text-align:center"> Your poll has been created and publish for all user <h2>' +
                  '<div id = "url_publish_poll">' +
            '</div></div></div>' +
            '<div class = "div-poll">' +
              '<div id = "id_poll_text" class = "publish-poll-text">' + document.poll_string + '</div>' +
            '<ol id = "id_poll_option">';
    var no_of_option = document.poll_option.length;
    for(var i = 1; i <= no_of_option; i++){
     body = body + '<li class = "nostyle publish-poll-text">' +
        '<input type = "radio" class = "radio-btn" id = "option" value =' + "option" + i + ' name = "options"/>' +
        '<label for = "option1">'  +  document.poll_option[i-1]["poll_option" + i] + '</label>' +
       '</li>';
    }
      //         '<li class = "nostyle publish-poll-text">' +
      //           '<input type = "radio" class = "radio-btn" id = "option1" value = "option1" name = "options"/>' +
      //           '<label for = "option1">'  +  document.poll_option1 + '</label>' +
      //         '</li>' +
      //         '<li class = "nostyle publish-poll-text">' +
      //           '<input type = "radio" class = "radio-btn" id = "option2" value = "option2" name = "options"/>' +
      //           '<label for = "option2">'  +  document.poll_option2 + '</label>' +
      //         '</li>';
      // if(document.poll_option3 !== undefined)
      // {
      //   var li = '<li class = "nostyle publish-poll-text">' +
      //               '<input type = "radio" class = "radio-btn" id = "option3" value = "option3" name = "options"/>' +
      //               '<label for = "option3">'  +  document.poll_option3 + '</label>' +
      //             '</li>';
      //   body = body + li;
      // }
      // if(document.poll_option4 !== undefined)
      // {
      //   var li = '<li class = "nostyle publish-poll-text">' +
      //               '<input type = "radio" class = "radio-btn" id = "option4" value = "option4" name = "options"/>' +
      //               '<label for = "option4">'  +  document.poll_option4 + '</label>' +
      //             '</li>';
      //   body = body + li;
      // }
      body = body + '</ol>'+
            '<div class = "div-view-poll">' +
                '<form class = "div-view-poll" action =' + "http://127.0.0.1:8080/view_poll/" + encodeURI(document.poll_string)   + '>' +
                  '<input  type = "submit" class = "btn" id = "id_btn_submit_poll" value = "Submit Poll"></input>' +
                  '<input type = "submit" class = "btn" id = "id_btn_view_poll" value = "View Poll"></input>' +
                '</form>' +
            '</div></div>' +
            '<div class = "footer">' +
              '<div class = "developerName">Developed by Aalok Gupta</div>' +
            '</div>';

    var html_str =  '<!DOCTYPE html>'
       + '<html> <head>'
       + '<link href="/public/css/main.css" rel="stylesheet" type="text/css">'
       + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
       + '</head>'
       + '<body class = "display-poll-container">'
       + body
       + '</body>' + script + '</html>';

       console.log("process "+process.cwd());
       return html_str;
}

module.exports = RequestHandler;
