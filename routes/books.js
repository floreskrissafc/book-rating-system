import { Router } from 'express';
const router = Router();
import { getMultiple, propose, searchBySingleColumnQuery, getBookInfoByID, deleteProposedBook } from '../services/books.js';
import logger from '../services/logging.js';
import Err from '../services/customError.js';
import * as reviews from '../services/reviews.js';

/* get a paginated list of books. */
router.get('/', function(req, res, next) {
  try {
    let allBooks = getMultiple(req.query.page);
    let booksWithAvgRating = allBooks.data.map(eachBook => {
      let avgRating = 1;
      try {
        let booksForReviews = reviews.getReviewsByBookId(eachBook.id);
        if (booksForReviews.data.length) {
          avgRating = booksForReviews.data.reduce(function (sum, eachReview) {
            return sum + eachReview.rating;
          }, 0)/booksForReviews.data.length;
        }
      } catch (error) {
        if (!error.message.includes('no reviews for this book yet')) {
          logger.error(`error getting reviews ${error.message}`);
        }
      }
      return {...eachBook, rating: avgRating};
    });

    return res.json({data: booksWithAvgRating, meta: allBooks.meta});
  } catch(err) {
    logger.error(`Error while getting books ${err.message}`);
    next(err);
  }
});

/** Route to propose a book. */
router.post('/propose', function(req, res, next) {
  try {
    res.json(propose(req.body));
  } catch (error) {
    logger.error(`Error proposing books ${error.message}`);
    next(error);
  }
});

/** search for a book by one of author, title or isbn. */
router.get('/search', function(req, res, next) {
  try {
    logger.info(`req.query: ${JSON.stringify(req.query, null, 4)}`);
    // NOTE: the variable names should match columns in schemas/books.sql
    const authors = req.query.authorquery;
    const title = req.query.titlequery;
    const isbn = req.query.isbnquery;
    const queries = [{authors}, {title}, {isbn}].filter((query) => Object.keys(query).length >= 0 && Object.values(query)[0] != undefined);
    logger.info(`queries: ${JSON.stringify(queries, null, 4)}`);
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
    logger.error(`Error while searching book ${error.message}`);
    next(error);
  }
});

/** Route to get a book by id */
router.get("byid/:bookId", function(req, res, next) {
  try {
    const bookData = getBookInfoByID(req.params.bookId);
    if (!bookData) {
      throw new Error(`No book found for id: ${req.params.bookId}`);
    }
    const rating = reviews.getAvgRatingForBook(req.params.bookId);
    return res.json({...bookData, rating});
    
  } catch (error) {
    logger.error(`Error while gett book ${error.message}`);
    next(error);
  }
});

export default router;
