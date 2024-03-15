const express = require('express');
const router = express.Router();
const UpdateBookController = require('../Controller/UpdateBookController');

router.post('/UpdateBook', UpdateBookController.UpdateBook);

module.exports = router;