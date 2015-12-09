var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  tokens: Array,
  event: {
    eventname: { type: String, default: '' }
  }
});
