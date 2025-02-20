const express = require('express');
const router = express.Router();
const books = require('../services/books');
const Err = require('../services/customError');

/* POST books */
router.post('/', function(req, res, next) {
    try {
        res.json(books.create(req.body));
    } catch(err) {
        if (err.message.toLowerCase().includes('unique constraint failed')) {
            next(new Err(`The book ${req.body.title} already exists in the system for module ${req.body.module_name}. Do you want to add a different book?`, 400));
        } else {
            console.error(`Error while adding books `, err.message);
            next(err);
        }
    }
});

router.get('/proposed', function(req, res, next){
    try {
        res.json(books.getProposedMultiple(req.query.page));
    } catch (error) {
        console.error(`Error while adding books `, error.message);
        next(error);
    }
});

router.post('/update', function(req, res, next) {
    try {
        res.json(books.update(req.body));
    } catch (error) {
        console.error(`Error while updating book`, error.message);
        next(error);
    }
});

router.delete('/', function(req, res, next) {
    try {
        res.json(books.deleteBook(req.body));
    } catch (error) {
        console.error(`Error while deleting book`, error.message);
        next(error);
    }
});

module.exports = router;