var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  event: {
    eventname: { type: String, default: '' },
    eventdesc: { type: String, default: '' },
    eventopendate: { type: String, default: '' },
    eventenddate: { type: String, default: '' },
    registrationtype: { type: String, default: '' },
    jurytype: { type: String, default: '' },
  }
});

module.exports = mongoose.model('Event', eventSchema);