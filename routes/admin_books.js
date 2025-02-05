const express = require('express');
const router = express.Router();
const books = require('../services/books');

/* POST books */
router.post('/', function(req, res, next) {
    try {
        res.json(books.create(req.body));
    } catch(err) {
        console.error(`Error while adding books `, err.message);
        next(err);
    }
});

module.exports = router;