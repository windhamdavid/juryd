var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/user');
var Entry = require('../models/entry');
var secure = require('../config/secure');


/********** GET / Entry **************/

exports.getEntry = function (req, res) {
  res.render('entry/entry', {
    title: 'Entry'
  });
};



/********** GET / New Entry **************/

exports.getEntry_new = function (req, res) {
  res.render('entry/event_new', {
    title: 'Create an Entry'
  });
};


/********** POST / New Entry **************/

exports.postEntry_new= function(req, res, next) {

  var errors = req.validationErrors();

  var event = new Entry ({
    entryname: req.body.evenname
  });

  Event.findOne({ eventname: req.body.eventname }, function(err, existingEvent) {
    if (existingEvent) {
      req.flash('errors', { msg: 'Event with that name already exists.' });
      return res.redirect('/entry/error');
    }
    event.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success!' });
      res.redirect(req.session.returnTo || '/');
    });
  });
  
};