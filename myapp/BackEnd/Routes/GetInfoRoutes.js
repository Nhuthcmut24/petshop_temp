const express = require('express');
const router = express.Router();
const GetInfoController = require('../Controller/GetInfoController');

router.get('/GetAdmin', GetInfoController.GetAdmin);
router.get('/GetOrder', GetInfoController.GetOrder);
router.get('/GetOrderConfirm', GetInfoController.GetOrderConfirm);
router.get('/GetListBook', GetInfoController.GetListBook);
router.get('/GetBook', GetInfoController.GetBook);
router.get('/SearchOrder', GetInfoController.SearchOrder);

module.exports = router;
