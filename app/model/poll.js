'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
          poll: {poll_string: String,
                 poll_option: Number,
                 twitter_id: String,
                }
});
module.exports = mongoose.model('Poll', Poll);
