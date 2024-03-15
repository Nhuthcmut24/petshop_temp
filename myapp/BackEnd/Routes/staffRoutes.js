const express = require('express');
const router = express.Router();
const staffController = require('../Controller/staffController');

router.get('/staffInfo/:username', staffController.getInfo);
router.put('/updateStaffEmail/:username', staffController.updateEmail);
router.put('/updateStaffAddress/:username', staffController.updateAddress);
router.put('/updateStaffPassword/:username', staffController.updatePassword);

module.exports = router;