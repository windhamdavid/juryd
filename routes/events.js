var express = require('express');
var app = express();
var router = express.Router();
var eventsController = require('../controllers/events');

router.get('../event', eventsController.getEvent);

module.exports = router;