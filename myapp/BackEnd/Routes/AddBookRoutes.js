const express = require('express');
const router = express.Router();
const AddBookController = require('../Controller/AddBookController');

router.post('/AddBook', AddBookController.AddBook);

module.exports = router;