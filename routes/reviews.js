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

router.get('/bybook', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByBookId(req.query.book_id));
    } catch (error) {
        console.log(`Error while getting review by bookId`, error.message);
        next(error);
    }
});

router.get('/byuser', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByUserId(req.query.user_id));
    } catch (error) {
        console.log(`Error while getting review by user_id`, error.message);
        next(error);
    }
});

// This is used for both "remove a review by user" and "Remove a review for a  book by admin."
router.delete('/', function(req, res, next) {
    try {
        if (!req.body.book_id) {
            let error = new Error(`no book_id present in req.body`);
            error.statusCode = 400;
            throw error;
        }
        if (!req.body.user_id) {
            let error = new Error(`no user_id present in req.body`);
            error.statusCode = 400;
            throw error;
        }
        res.json(reviewsService.deleteReview(req.body.book_id, req.body.user_id));
    } catch (error) {
        console.log(`Error while deleting review`, error.message);
        next(error);
    }
});

module.exports = router;