'use strict';
var Poll = require('../model/poll.js');

function clickHandler(){
  this.createPoll = function(req, res){
    // var db = mongoose.createConnection('mongodb://localhost:27017/votingapp');

    console.log("req param = "+req.user.twitter.userName +" "+req.user.twitter.id);
    console.log("req_poll = "+JSON.stringify(req.body));
    console.log("req_poll = "+req.body[0].poll_string);
    console.log("inside create poll");

    var no_of_json_str = Object.keys(req.body).length;
    console.log("no of json element = "+Object.keys(req.body).length);
    var newPoll = new Poll();

    newPoll.poll_string = req.body[0].poll_string;
    newPoll.poll_option1 = req.body[1].poll_option1;
    newPoll.poll_option2 = req.body[2].poll_option2;

    if(no_of_json_str >= 4){
      newPoll.poll_option3 = req.body[3].poll_option3;
    }
    if(no_of_json_str >= 5){
      newPoll.poll_option4 = req.body[4].poll_option4;
    }
    newPoll.twitter_id  = req.user.twitter.id;
    console.log("newPole Obj "+newPoll.poll_string + "  "+newPoll.poll_option1+"   "+newPoll.twitter_id);
    newPoll.save(function(err){
      if(err){
        throw err;
      }
      Poll.findOne({'poll_string': req.body[0].poll_string}, {_id: false})
          .exec(function(err, result){
            if(err){
              throw err;
            }
            console.log("f####etch data frm db "+result.poll_string + " "+result.poll_option1);
          });
      console.log("new poll has been created and saved into database");
      res.setHeader('Content-Type', 'application/json');
      var url = "http://127.0.0.1:8080/aalok/" + req.body[0].poll_string;
      console.log("poll url generated "+url);
      res.send({"poll_url": url});
    });
  };

  this.deletePoll = function(req, res){

  };

  this.viewPoll = function(req, res){

  };

}
module.exports = clickHandler;
