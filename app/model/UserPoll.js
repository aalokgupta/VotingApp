'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPoll = new Schema(
                 { poll_string: String,
                  No_of_vote1: Number,
                  No_of_vote2: Number,
                  No_of_vote3: Number,
                  No_of_vote4: Number
               });

module.exports = mongoose.model('UserPoll', UserPoll);
