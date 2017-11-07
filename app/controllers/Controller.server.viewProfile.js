'use strict'

var Poll = require('../model/poll.js');

function viewProfile(twitter_id, callback){
      console.log("inside view Profile");
      Poll.find({"twitter_id": twitter_id}, {_id: false,   poll_option1: false,   poll_option2: false,
                poll_option3: false,   poll_option4: false, __v: false})
                .exec(function(err, result){
                  if(err){
                    throw err;
                  }
                  if(result){
                      var html = buildHtml(JSON.stringify(result));
                      return callback(null, html);
                  }
                  else{
                    var html = '<html><body><h2>No Poll found for the user</h2></body></html>';
                    return callback(null, html);
                  }
                });
};
function build_script(result){


  var ajax_function = 'function ajaxRequest(method, url, data) { ' +
                      'var xmlhttp = new XMLHttpRequest();' +
                      'xmlhttp.open(method, url, true);' +
                      'xmlhttp.setRequestHeader("Content-Type", "application/json");' +
                      'xmlhttp.onreadystatechange=function(){' +
                        'if (xmlhttp.readyState === 4 && xmlhttp.status === 200){' +
                          'string=xmlhttp.responseText;' +
                          'console.log("response from server "+string);' +
                          '}' +
                        '};'+
                        'xmlhttp.send(JSON.stringify(data));' +
                      '}'

    var json = JSON.parse(result);
    var on_click_del_btn = 'function on_click_delete_poll(poll_str, i){'+
                                'console.log("poll_str = "+poll_str);' +
                                'var url = "http://127.0.0.1:8080/delete_poll";' +
                                 'var data = {"poll_string": poll_str};' +
                                 'console.log("data = "+JSON.stringify(data));' +
                                 'var liId = "poll" + i;'+
                                'ajaxRequest("POST", url, data);'+
                                // 'ajaxRequest("GET", "http://127.0.0.1:8080/profile", "{}");'+
                            '}';
    var script = '<script>' +
                   ajax_function +
                   on_click_del_btn +
                  '</script>';
    return script;
}
function getPollList(result){
  var no_of_poll = JSON.parse(result).length;
  console.log("result = "+no_of_poll);
  var json = JSON.parse(result);
  console.log("result = "+json[0].poll_string);
// +json[i-1].poll_string
// + ' name =' + '"' + poll + '"' + '
  var li = '';
  for(var i=1; i<=no_of_poll; i++){
    console.log('poll string for ['+i+"] = "+json[i-1].poll_string);
     var poll = "poll" + i;
    li = li + '<li id =' + poll + 'class = "nostyle div_display_poll">' +
            '<label class = "label_poll_text" for = ' + poll + '>' + json[i-1].poll_string + '</label>' +
            '<input type = "button"  class = "btn"  value = "Delete" onclick = on_click_delete_poll(' + '"' + encodeURI(json[i-1].poll_string) + '"' + "," + i +')' + '>' +
          '</li>';
    }
    return li;
}
function buildHtml(result){
  var script = build_script(result);
  console.log("no of result = "+result.length);
  var list_of_poll = getPollList(result);
  var body =  '<div class = "header">' +
            '<div class = "">' +
            '<h1> Hello! <h2>' +
            '<div id = "url_publish_poll">' +
            '</div></div></div>' +
            '<div class = "div-poll">' +
              '<div id = "id_list_of_poll" class = "publish-poll-text"></div>' +
            '<div> ' +
            '<ol id = "ol">' +
            list_of_poll +
            '</ol> </div>';

    var html_str =  '<!DOCTYPE html>'
       + '<html> <head>'
       + '<link href="/public/css/main.css" rel="stylesheet" type="text/css">'
       + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
       + '</head>'
       + '<body class = "display-poll-container">'
       +  body
       + '</body>'
       +  script
       +  '</html>';

       console.log("process "+process.cwd());
       return html_str;
}

module.exports = viewProfile;