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

router.post('/propose', function(req, res, next) {
  try {
    res.json(books.propose(req.body));
  } catch (error) {
    console.error(`Error proposing books `, error.message);
    next(error);
  }
});

router.get('/search', function(req, res, next) {
  try {
    console.log("req.query", req.query);
    // NOTE: the variable names should match columns in schemas/books.sql
    authors = req.query.authorquery;
    title = req.query.titlequery;
    isbn = req.query.isbnquery;
    queries = [{authors}, {title}, {isbn}].filter((query) => Object.keys(query).length >= 0 && Object.values(query)[0] != undefined);
    console.log('queries', queries);
    if (queries.length != 1) {
      throw new Err('Either Search by ISBN, Title or Authors', 400);
    }
    let column = Object.keys(queries[0])[0];
    let query = Object.values(queries[0])[0];
    if (!query) {
      return res.json({data:[]});
    }
    return res.json(books.searchBySingleColumnQuery(column, query));
  } catch (error) {
    console.error(`Error while searching book`, error.message);
    next(error);
  }
});


module.exports = router;
