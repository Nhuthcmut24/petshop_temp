const express = require('express');
const router = express.Router();
const ConfirmController = require('../Controller/ConfirmController');

router.post('/Confirm', ConfirmController.Confirm);

module.exports = router;