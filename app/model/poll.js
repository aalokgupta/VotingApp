'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema(
                 { poll_string: String,
                  poll_option1: String,
                  poll_option2: String,
                  poll_option3: String,
                  poll_option4: String,
                  twitter_id: String
               });
               
module.exports = mongoose.model('Poll', Poll);
