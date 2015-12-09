var secure = require('../config/secure');
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: secure.mandrill.user,
    pass: secure.mandrill.password
  }
});


/********** GET / Contact **************/

exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};


/********** POST / Contact **************/

exports.postContact = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'admin@juryd.com';
  var subject = 'Contact Form | Juryd';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};