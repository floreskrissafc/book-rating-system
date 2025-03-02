import express from 'express';
import * as books from '../services/books.js';
import Err from '../services/customError.js';
import logger from '../services/logging.js';

const router = express.Router();

/** admin only route to add a new book. */
router.post('/', function(req, res, next) {
    try {
        res.json(books.create(req.body));
    } catch(err) {
        if (err.message.toLowerCase().includes('unique constraint failed')) {
            next(new Err(`The book ${req.body.title} already exists in the system for module ${req.body.module_name}. Do you want to add a different book?`, 400));
        } else {
            logger.error(`Error while adding books `, err.message);
            next(err);
        }
    }
});

/** admin only route to get a paginated list of proposed books. */
router.get('/proposed', function(req, res, next){
    try {
        res.json(books.getProposedMultiple(req.query.page));
    } catch (error) {
        logger.error(`Error while adding books `, error.message);
        next(error);
    }
});

/** admin only route to update a book's title title, author and other fields. */
router.post('/update', function(req, res, next) {
    try {
        res.json(books.update(req.body));
    } catch (error) {
        logger.error(`Error while updating book`, error.message);
        next(error);
    }
});

/** admin only route to delete a book. */
router.delete('/', function(req, res, next) {
    try {
        res.json(books.deleteBook(req.body));
    } catch (error) {
        logger.error(`Error while deleting book`, error.message);
        next(error);
    }
});

export default router;