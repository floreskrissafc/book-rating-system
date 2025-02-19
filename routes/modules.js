const express = require('express');
const router = express.Router();
const modules = require('../services/modules');
const books = require('../services/books');

/* GET modules listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(modules.getMultiple(req.query.page));
  } catch(err) {
    console.error(`Error while getting modules `, err.message);
    next(err);
  }
});


/* GET book by module Ids. */
router.post('/filter', function(req, res, next) {
  try {
    if (!req.body || !req.body.ids || req.body.ids.length <= 0) {
      let error = new Error("Please select at least one module");
      error.statusCode = 400;
      throw error;
    }
    res.json(books.getBooksByModulesIds(req.body.ids));
  } catch (error) {
    console.error(`Error while getting books by module id`, err.message);
    next(error);
  }
});

module.exports = router;