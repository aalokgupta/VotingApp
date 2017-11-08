'use strict';

var UserPoll = require('../model/UserPoll.js');
var Poll  = require('../model/poll.js');

var viewPollHandler = function(poll_string, callback){
    console.log("inside viewPollHandler poll sting "+poll_string);
    UserPoll.findOne({'poll_string': poll_string}, {id: false})
            .exec(function(err, document){
              if(err){
                var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                return callback(null, html);
              }
              if(document){
                  console.log("Users poll has been fetched from db "+document);
                  Poll.findOne({'poll_string':poll_string}, {_id: false})
                  .exec(function(err, poll){
                    if(err){
                      var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                      return callback(null, html);
                    }
                    var html = build_html(document, poll);
                    callback(null, html);
                  });
              }
              else{
                 var html = '<html><body><h2>Requested Poll not found</h2></body></html>';
                 return callback(null, html);
              }
            });
};

function chart_prepration(document, poll){
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });
}

function prepare_html_body(document){

  var body = '<body class = "display-poll-container">' +
              '<div class = "header">' +
             '<div class = "">' +
             '<h1> Report for the Poll <h2>' +
             '<div id = "url_publish_poll">' +
             '</div></div></div>' +
             '<div class = "div-poll">' +
              '<div id = "id_poll_text" class = "publish-poll-text">' + document.poll_string + '</div>' +
              '<div class = "canvas"> '+
                '<canvas id="myChart"></canvas>' +
            '</div><div></body>';
      return body;
}

function prepare_script(document, poll){

    var vote_data = [document.No_of_vote1, document.No_of_vote2, document.No_of_vote3, document.No_of_vote4];
    var vote_labels = ['"'+poll.poll_option1+'"', '"' + poll.poll_option2 +'"', '"' + poll.poll_option3 + '"', '"' + poll.poll_option4 + '"'];
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
