'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPoll = new Schema(
                 { poll_string: String
               }, {strict: false});

module.exports = mongoose.model('UserPoll', UserPoll);
