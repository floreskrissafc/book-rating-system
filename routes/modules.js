import express  from 'express';
const router = express.Router();
import * as modules from '../services/modules.js';
import * as books from '../services/books.js';
import Err from '../services/customError.js';
import logger from '../services/logging.js';

/* GET modules listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(modules.getMultiple(req.query.page));
  } catch(err) {
    logger.error(`Error while getting modules ${err.message}`);
    next(err);
  }
});

router.get('/books/:moduleId', function(req, res, next) {
  try {
    let moduleId = req.params.moduleId;
    const allBooks = books.getBooksByModulesIds([moduleId]);
    return res.json({"data": allBooks[moduleId]});
  } catch (error) {
    logger.error(`Error while getting books by module id ${error.message}`);
    next(error);
  }
});

/* GET book by module Ids. */
router.post('/filter', function(req, res, next) {
  try {
    if (!req.body || !req.body.ids || req.body.ids.length <= 0) {
      throw new Err("Please select at least one module", 400);
    }
    res.json(books.getBooksByModulesIds(req.body.ids));
  } catch (error) {
    logger.error(`Error while getting books by module id ${error.message}`);
    next(error);
  }
});

export default router;