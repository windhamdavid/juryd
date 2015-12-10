var express = require('express');
var app = express();
var router = express.Router();
var eventsController = require('../controllers/entry_control');

router.get('/entry', entryController.getEvent);

module.exports = router;