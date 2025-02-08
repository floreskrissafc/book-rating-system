const express = require('express')
const router = express.Router();
const reviewsService = require('../services/reviews');

router.post('/', function (req, res, next) {
    try {
        res.json(reviewsService.create(req.body));
    } catch (error) {
        console.log(`Error while posting review`, error.message);
        next(error);
    }
});

router.get('/', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByBookId(req.query.book_id));
    } catch (error) {
        console.log(`Error while getting review`, error.message);
        next(error);
    }
});

module.exports = router;