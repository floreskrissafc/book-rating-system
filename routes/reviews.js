import express from 'express';
const router = express.Router();
import * as reviewsService from '../services/reviews.js';
import logger from '../services/logging.js';
import Err from '../services/customError.js';

/** create a new review */
router.post('/', function (req, res, next) {
    try {
        res.json(reviewsService.create(req.body));
    } catch (error) {
        logger.error(`Error while posting review ${error.message}`);
        next(error);
    }
});

/** get all reviews given a particular book id. */
router.get('/bybook/:bookId', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByBookId(req.params.bookId));
    } catch (error) {
        logger.error(`Error while getting review by bookId ${error.message}`);
        next(error);
    }
});

/** get all reviews given a particular users id. */
router.get('/byuser/:userId', function(req, res, next) {
    try {
        res.json(reviewsService.getReviewsByUserId(req.params.userId));
    } catch (error) {
        logger.error(`Error while getting review by user_id ${error.message}`);
        next(error);
    }
});

/** this is used to delete a review 
 * NOTE: this same route is used for both "remove a review by user" and "Remove a review for a book by admin.
*/
router.delete('/', function(req, res, next) {
    try {
        if (!req.body.book_id) {
            throw new Err(`no book_id present in req.body`, 404);
        }
        if (!req.body.user_id) {
            throw new Err(`no user_id present in req.body`, 404);
        }
        res.json(reviewsService.deleteReview(req.body.book_id, req.body.user_id));
    } catch (error) {
        logger.error(`Error while deleting review ${error.message}`);
        next(error);
    }
});

/** update the comment and/or rating for an existing review given a book_id, user_id */
router.post('/update', async function(req, res, next) {
    try {
        if (!req.body.book_id) {
            throw new Err(`no book_id present in req.body`, 404);
        }
        if (!req.body.user_id) {
            throw new Err(`no user_id present in req.body`, 404);
        }
        return res.json(await reviewsService.update(req.body.book_id, req.body.user_id, req.body));
    } catch (error) {
        logger.error(`Error while updating review ${error.message}`);
        next(error);
    }
});

export default router;