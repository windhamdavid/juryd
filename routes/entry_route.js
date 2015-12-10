var express = require('express');
var app = express();
var router = express.Router();
var entryController = require('../controllers/entry_control');

router.get('/entry', entryController.getEntry);

module.exports = router;