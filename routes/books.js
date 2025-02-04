const express = require('express');
const router = express.Router();
const books = require('../services/books');

/* GET books listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(books.getMultiple(req.query.page));
  } catch(err) {
    console.error(`Error while getting books `, err.message);
    next(err);
  }
});

router.get('/search', function(req, res, next) {
  try {
    console.log("req.query", req.query);
    author = req.query.authorquery;
    title = req.query.titlequery;
    console.log('authorQuery: ', author);
    console.log('titleQuery: ', title);
    if ((!author && !title) || (author && title)) {
      let error = new Error('Either Search by Author or Title');
      error.statusCode = 400;
      throw(error)
    }
    if (author && author.length) {
      return res.json(books.searchByAuthors(author));
    }
    if (title && title.length) {
      return res.json(books.searchByTitle(title));
    }
    let error = new Error('Invalid search query')
    throw error;
  } catch (error) {
    console.error(`Error while searching book`, error.message);
    next(error);
  }
});

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
