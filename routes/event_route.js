var express = require('express');
var app = express();
var router = express.Router();
var eventController = require('../controllers/event_control');

router.get('/event', eventController.getEvent);

module.exports = router;