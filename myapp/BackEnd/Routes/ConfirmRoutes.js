const express = require("express");
const router = express.Router();
const ConfirmController = require("../Controller/ConfirmController");

router.put("/Confirm", ConfirmController.Confirm);

module.exports = router;
