'use strict';

var UserPoll = require('../model/UserPoll.js');
var Poll  = require('../model/poll.js');

var viewPollHandler = function(poll_string, callback){
    console.log("inside viewPollHandler poll sting "+poll_string);
    UserPoll.findOne({poll_string: poll_string}, {_id: false}, function(err, userpoll){
              if(err){
                var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                return callback(null, html);
              }
              if(userpoll){
                  console.log("Users poll has been fetched from db "+userpoll);

                  Poll.findOne({'poll_string':poll_string}, {_id: false})
                  .exec(function(err, poll){
                    if(err){
                      var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                      return callback(null, html);
                    }
                    var html = build_html(userpoll, poll);
                    callback(null, html);
                  });
              }
              else{
                 var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                 return callback(null, html);
              }
            });
};


function prepare_html_body(document){

  var body = '<body class = "display-poll-container">' +
                '<div class = "create-poll-header">' +
                  '<div class = "user-name">Welcome <span id = "id_user_name"> Aalok </span> </div>' +
                  '<div style = "padding-top: 30px">' +
                    '<a href = "/profile">' +
                    '<button class = "btn user-profile">View Poll</button>' +
                    '</a>' +
                    '<a href = "/logout">' +
                    '<button class = "btn user-logout">LogOut</button>' +
                  '</a>' +
                  '</div>' +
                '</div>' +
             '<div class = "div-poll">' +
              '<div id = "id_poll_text" class = "publish-poll-text">' + document.poll_string + '</div>' +
              '<div class = "canvas"> '+
                '<canvas id="myChart"></canvas>' +
            '</div><div></body>';
      return body;
}

function prepare_script(userpoll, poll){

    var no_of_option = poll.poll_option.length;
    var vote_data = [];
    var vote_labels = [];
    var backgroundColor = [];
    var borderColor = [];

    for(var i=1; i <= no_of_option; i++){

      var vote_option = "No_of_vote" + i;
      var json = [];
      json = (JSON.stringify(userpoll)).split(",");
      var no_of_vote = json[i].split(':')[1];
      console.log("No of votes for "+i +" = "+userpoll.No_of_vote1);
      vote_data.push(no_of_vote);
      vote_labels.push('"' + poll.poll_option[i-1]["poll_option"+i] + '"');
      //backgroundColor.push(rgba())

    }
    var script = '<script>' +
                  'var ctx = document.getElementById("myChart").getContext("2d");' +
                  'var myChart = new Chart(ctx, {' +
                  'type: "bar",' +
                  'data: {' +
                  'labels:' + "[" + vote_labels + "]" + ',' +
                  'datasets: [{' +
                  'label: "# of Votes",' +
                  'data:' + "[" + vote_data + "]" + ',' +
                  'backgroundColor: [' +
                  '"rgba(255, 99, 132, 1)",' +
                  '"rgba(54, 162, 235, 1)",' +
                  '"rgba(255, 206, 86, 1)",' +
                  '"rgba(75, 192, 192, 1)"' +
                '],'+
            'borderColor: [' +
                '"rgba(255, 99, 132, 1)",' +
                '"rgba(54, 162, 235, 1)",' +
                '"rgba(255, 206, 86, 1)",' +
                '"rgba(75, 192, 192, 1)"' +
            '],' +
            'borderWidth: 4' +
        '}]' +
    '},' +
    'options: {' +
        'scales: {' +
            'yAxes: [{' +
                'ticks: {' +
                    'beginAtZero:true'+
                '}' +
            '}]' +
        '}' +
    '}' +
'});' +
'</script>'
return script;
}

function build_html(document, poll){

  var body = prepare_html_body(document);
  var script = prepare_script(document, poll);

  var html_script =   '<!DOCTYPE html>'
                    + '<html> <head>'
                    + '<link href="/public/css/main.css" rel="stylesheet" type="text/css">'
                    + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>'
                    + '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>'
                    + '</head>'
                    +  body
                    + script
                    + '</html>';

      return html_script;
}
module.exports = viewPollHandler;
