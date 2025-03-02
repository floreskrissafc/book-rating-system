import express from 'express';
const router = express.Router();
import * as reviewsService from '../services/reviews.js';
import logger from '../services/logging.js';

/** create a new review */
router.post('/', function (req, res, next) {
    try {
        res.json(reviewsService.create(req.body));
    } catch (error) {
        logger.error(`Error while posting review`, error.message);
        next(error);
    }
});

/** get all reviews given a particular book id. */
router.get('/bybook', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByBookId(req.query.book_id));
    } catch (error) {
        logger.error(`Error while getting review by bookId`, error.message);
        next(error);
    }
});

/** get all reviews given a particular users id. */
router.get('/byuser', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByUserId(req.query.user_id));
    } catch (error) {
        logger.error(`Error while getting review by user_id`, error.message);
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
        logger.error(`Error while deleting review`, error.message);
        next(error);
    }
});

export default router;