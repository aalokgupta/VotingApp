'use strict';
var Poll = require('../model/poll.js');
var UserPoll = require('../model/UserPoll.js');
var mongoclient = require('mongodb').MongoClient;

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


    newPoll.poll_string =  req.body[0].poll_string;

    var json = {};
    for(var i=1; i<no_of_json_str; i++){
      console.log("poll option i = "+req.body[i]["poll_option" + i]);
      // newPoll["poll_option" + i] = req.body[i]["poll_option" + i];
      // console.log("poll option i = "+newPoll["poll_option" + i]);
      var option = {["poll_option" + i]: req.body[i]["poll_option" + i]};
      newPoll.poll_option.push(option);
      var vote = {["No_of_vote" + i]: 0};
      json["No_of_vote" + i] = 0;
    }
    var userPoll = new UserPoll(json);
    userPoll.poll_string = req.body[0].poll_string;

    console.log("userPoll = "+userPoll);
    console.log("newPoll = "+JSON.stringify(newPoll));
    // newPoll.poll_option1 = req.body[1].poll_option1;
    // newPoll.poll_option2 = req.body[2].poll_option2;
    //
    // userPoll.poll_string = req.body[0].poll_string;
    // userPoll.no_of_vote1 = 0;
    // userPoll.No_of_vote2 = 0;
    //
    // if(no_of_json_str >= 4){
    //   newPoll.poll_option3 = req.body[3].poll_option3;
    //   userPoll.No_of_vote3 = 0;



    // }
    // if(no_of_json_str >= 5){
    //   newPoll.poll_option4 = req.body[4].poll_option4;
    //   userPoll.No_of_vote4 = 0;
    // }
    newPoll.twitter_id  = req.user.twitter.id;
    console.log("newPole Obj "+newPoll.poll_string + "  "+newPoll.poll_option1+"   "+newPoll.twitter_id);
    newPoll.save(function(err){
      if(err){
        throw err;
      }
      userPoll.save(function(err){
        if(err){
          throw err;
        }
      });
      // Poll.findOne({'poll_string': req.body[0].poll_string}, {_id: false})
      //     .exec(function(err, result){
      //       if(err){
      //         throw err;
      //       }
      //       console.log("f####etch data frm db "+result.poll_string + " "+result.poll_option1);
      //     });
      console.log("new poll has been created and saved into database");
      res.setHeader('Content-Type', 'application/json');
      var url = "http://127.0.0.1:8080/"+ req.user.twitter.userName + "/" + req.body[0].poll_string;
      console.log("poll url generated "+url);
      res.send({"poll_url": url});
    });
  };

  this.deletePoll = function(req, res){
    var poll_string = decodeURI(req.body.poll_string);
    console.log("delete poll_string "+poll_string);
    Poll.remove({poll_string: poll_string}, function(err, res){
        if(err){
        }
        console.log(poll_string + " has been removed from Poll db");
        UserPoll.remove({poll_string: poll_string}, function(err, res){
          if(err){
          }
          console.log(poll_string+" has been removed from UserPoll");
        });
    });
  };

  this.viewPoll = function(req, res){

  };

  this.userPoll = function(req, res){
    console.log("inside user Poll "+req.body.poll_string);
    console.log("inside user Poll "+req.body.option);
    var option = req.body.option;
    var update;
    // var key = UserPoll.votes["No_of_vote" + option];
    console.log("key = "+option);

    // else if(option === 2)
    //   update = {'No_of_vote2': 1};
    // else if(option === 3)
    //   update = {'No_of_vote3': 1};
    // else if(option === 4)
    //   update = {'No_of_vote4': 1};
    // UserPoll.findOne({'poll_string': req.body.poll_string}).then(userpoll => {
    //   let votes = userpoll.votes[option-1];
    //   console.log("inside query "+votes);
    //   var curr_no_of_vote = votes["No_of_vote"+option];
    //   console.log("No of votes "+votes["No_of_vote"+option]);
    //   votes.No_of_vote1 = curr_no_of_vote + 1;
    //
    //   console.log("No of votes "+votes["No_of_vote"+option]);
    //   return userpoll.save();
    // });



    var option_no = "No_of_vote" + option;
    // req.body.poll_string}
    update = {["No_of_vote" + option]: 1};
    console.log("vote = "+JSON.stringify(update));
    mongoclient.connect('mongodb://localhost:27017/votingapp', function(err, db){
      var col = db.collection("userpolls");
      if(err){
        return err;
      }
      else{
          col.findOne({poll_string: req.body.poll_string}, function(err, result){
              if(err){

              }
              console.log("find result  "+JSON.stringify(result));
          });
        col.findOneAndUpdate({poll_string: req.body.poll_string},
                             {$inc: {["No_of_vote" + option]: 1}},
                             function(err, doc){
                                if(err){
                                  console.log("error on updating document "+err);
                                }
                                else{
                                  console.log("document updated = "+doc);
                                }
                             });
          // console.log("poll_string = "+req.body.poll_string);
          //             col.findAndModify({
          //                 query: {poll_string: "favourite dish?"},
          //                 update: {$inc: {No_of_vote1: 1} },
          //                 new: true},
          //                 function(err, result){
          //                   if(err){
          //
          //                   }
          //                   console.log("find and modified = "+result);
          //                 });
          //                 db.close();
      }
    });
  };
}
module.exports = clickHandler;
