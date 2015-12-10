var express = require('express');
var app = express();
var router = express.Router();
var eventsController = require('../controllers/events');

router.get('/entry', eventsController.getEvent);

module.exports = router;