import { Router } from 'express';
const router = Router();
import { getMultiple, propose, searchBySingleColumnQuery } from '../services/books.js';
import logger from '../services/logging.js';
import Err from '../services/customError.js';

/* GET books listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(getMultiple(req.query.page));
  } catch(err) {
    logger.error(`Error while getting books `, err.message);
    next(err);
  }
});

router.post('/propose', function(req, res, next) {
  try {
    res.json(propose(req.body));
  } catch (error) {
    logger.error(`Error proposing books `, error.message);
    next(error);
  }
});

router.get('/search', function(req, res, next) {
  try {
    logger.info("req.query", req.query);
    // NOTE: the variable names should match columns in schemas/books.sql
    const authors = req.query.authorquery;
    const title = req.query.titlequery;
    const isbn = req.query.isbnquery;
    const queries = [{authors}, {title}, {isbn}].filter((query) => Object.keys(query).length >= 0 && Object.values(query)[0] != undefined);
    logger.info('queries', queries);
    if (queries.length != 1) {
      throw new Err('Either Search by ISBN, Title or Authors', 400);
    }
    let column = Object.keys(queries[0])[0];
    let query = Object.values(queries[0])[0];
    if (!query) {
      return res.json({data:[]});
    }
    return res.json(searchBySingleColumnQuery(column, query));
  } catch (error) {
    logger.error(`Error while searching book`, error.message);
    next(error);
  }
});


export default router;
