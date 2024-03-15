const express = require('express');
const router = express.Router();
const AdminLoginController = require('../Controller/AdminLoginController');

router.post('/AdminLogin', AdminLoginController.AdminLogin);

module.exports = router;