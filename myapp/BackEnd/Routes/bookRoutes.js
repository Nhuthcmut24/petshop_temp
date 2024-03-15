const express = require('express');
const router = express.Router();
const bookController = require('../Controller/bookController');

router.get('/getBooksForHomePage', bookController.getBooksForHomePage);
router.get('/search', bookController.search);
router.get('/getProductDetails/:bookId', bookController.getProductDetails);
router.get('/getProductReviews/:bookId', bookController.getProductReviews);
router.post('/rating/:bookId', bookController.rating);

module.exports = router;