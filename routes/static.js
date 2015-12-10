var express = require('express');
var app = express();
var router = express.Router();


/********** static routes **************/

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'About' });
});
router.get('/docs', function(req, res) {
  res.render('pages/docs', { title: 'Documentation' });
});
router.get('/privacy', function(req, res) {
  res.render('pages/privacy', { title: 'Privacy Policy' });
});
router.get('/terms', function(req, res) {
  res.render('pages/terms', { title: 'Terms & Conditions' });
});
router.get('/status', function(req, res) {
  res.render('pages/status', { title: 'System Status' });
});
router.get('/support', function(req, res) {
  res.render('pages/support', { title: 'Support' });
});

module.exports = router