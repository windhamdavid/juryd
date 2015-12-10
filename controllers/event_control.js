var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/user');
var Event = require('../models/event');
var secure = require('../config/secure');


/********** GET / Event **************/

exports.getEvent = function (req, res) {
  res.render('event/event', {
    title: 'Event'
  });
};


/********** GET / New Event **************/

exports.getEvent_new = function (req, res) {
  res.render('event/event_new', {
    title: 'Create an Event'
  });
};


/********** POST / New Event **************/

exports.postEvent_new= function(req, res, next) {

  var event = new Event({
    eventname: req.body.eventname
  });
  
  var errors = req.validationErrors();

  Event.findOne({ eventname: req.body.eventname }, function(err, existingEvent) {
    if (existingEvent) {
      req.flash('errors', { msg: 'Event with that name already exists.' });
      return res.redirect('/event/error');
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



