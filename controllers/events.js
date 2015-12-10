var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/user');
var secure = require('../config/secure');


/********** GET / Event **************/

exports.getEvent = function (req, res) {
  res.render('events/event', {
    title: 'Events'
  });
};
