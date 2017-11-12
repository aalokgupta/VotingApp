'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema(
                 { poll_string: String,
                   twitter_id: String,
                   poll_option: []
               });

module.exports = mongoose.model('Poll', Poll);
