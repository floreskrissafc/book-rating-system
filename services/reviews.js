import * as db from './db.js';
import config from '../config.js';
import * as usersService from '../services/users.js';
import * as booksService from '../services/books.js';
import Err from '../services/customError.js';
import logger from '../services/logging.js';

import {
	RegExpMatcher,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';

const profanity = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});

function validateReview(review) {
    const { book_id, user_id, comment, rating } = review;
    if (!book_id) {
        throw new Err(`no book_id present`, 400);
    }

    if (!user_id) {
        throw new Err(`no user_id present`, 400);
    }

    if (!rating) {
        throw new Err(`no rating present`, 400);
    }

    if (comment && comment.length > config.COMMENT_CHAR_MAX_LENGTH) {
        throw new Err(`comment length greater than max allowed: ${config.COMMENT_CHAR_MAX_LENGTH}`, 400);
    }

    if (profanity.hasMatch(comment)) {
        throw new Err(`please remove offensive words from review`, 400);
    }
}

function validateReviewUpdate(review) {
    const { comment } = review;

    if (comment && comment.length > config.COMMENT_CHAR_MAX_LENGTH) {
        throw new Err(`comment length greater than max allowed: ${config.COMMENT_CHAR_MAX_LENGTH}`, 400);
    }

    if (profanity.hasMatch(comment)) {
        throw new Err(`please remove offensive words from review`, 400);
    }
}

function getReviewsByBookId(book_id) {
    if (!book_id) {
        throw new Err(`no book_id present`, 404);
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE book_id = ?`, [book_id]);
    // if (!data || !data.length) {
    //     throw new Err(`There are no reviews for this book yet. Be the first to write a review and share your thoughts with other students`, 200);
    // }

    data = data.map((review) => {
        let user = usersService.getUserInfoByID(review.user_id);
        return { ...review, ...user};
    });
    

    return {
        data
    };
}

function getReviewsByUserId(user_id) {
    if (!user_id) {
        throw new Err(`no user_id present`, 404);
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
    if (!data || !data.length) {
        throw new Err(`You have not created any reviews yet`, 404);
    }

    data = data.map((review) => {
        let book = booksService.getBookInfoByID(review.book_id);
        return { ...review, ...book};
    });
    

    return {
        data
    };
}

function create(reviewBody) {
    validateReview(reviewBody);
    const { book_id, user_id, comment, rating } = reviewBody;
    const result = db.run('INSERT OR REPLACE INTO reviews (book_id, user_id, comment, rating) VALUES (@book_id, @user_id, @comment, @rating)', {book_id, user_id, comment, rating});
    let message = 'Error in creating review';
    if (result.changes) {
      message = "Your review has been processed successfully";
    }

    return { message };
}

function deleteReview(book_id, user_id) {
    let message = "Error in deleting review";
    const result = db.run('DELETE FROM reviews WHERE book_id = @book_id AND user_id = @user_id', {book_id, user_id});
    if (result.changes) {
        message = "Your review has been processed successfully";
    }
    return { message };
}

function getReviewByUserForBook(book_id, user_id) {
    let data = db.queryAll(`SELECT * FROM reviews WHERE book_id = ? AND user_id = ?`, [book_id, user_id]);
    if (!data || !data.length || data.length != 1) {
        throw new Err(`Got multiple reivews for book_id: ${book_id}, user_id: ${user_id}`);
    }
    return data[0];
}

async function updateReviewField(book_id, user_id, name, value) {
    if (!book_id) {
        throw new Err(`Invalid book_id ${book_id}`, 500);
    }

    if (!user_id) {
        throw new Err(`Invalid user_id ${user_id}`, 500);
    }

    if (!name) {
        throw new Err(`Invalid name ${name}`, 500);
    }
    if (!value) {
        throw new Err(`Invalid value ${value}`, 500);
    }
    const result = db.run(`UPDATE reviews SET ${name}=@value WHERE book_id=@book_id AND user_id=@user_id`, {value, book_id, user_id});
    if (!result.changes) {
     throw new Err(`Error updating review ${name}: ${value}`, 500);
    }
    return `updated ${name}: ${value}`;
  }

async function update(book_id, user_id, reviewBody) {
    validateReviewUpdate(reviewBody);
    const currentReview = getReviewByUserForBook(book_id, user_id);
    if (!currentReview) {
        throw new Err(`No review found for book_id: ${book_id} and user_id: ${user_id}`);
    }
    let updates = [];
    if (reviewBody.comment && reviewBody.comment != currentReview.comment) {
        updates.push(await updateReviewField(book_id, user_id, 'comment', reviewBody.comment));
    }
    if (reviewBody.rating && reviewBody.rating != currentReview.rating) {
        updates.push(await updateReviewField(book_id, user_id, 'rating', reviewBody.rating));
    }

    logger.info(`${updates.join(', ')}`);
    let message = `The review ${book_id} ${user_id} has been updated.`;
    return {message};
}

function getAvgRatingForBook(book_id) {
    try {
        let booksForReviews = getReviewsByBookId(book_id);
        if (booksForReviews.data.length) {
          return booksForReviews.data.reduce(function (sum, eachReview) {
            return sum + eachReview.rating;
          }, 0)/booksForReviews.data.length;
        }
        return 1;
      } catch (error) {
        if (!error.message.includes('no reviews for this book yet')) {
          logger.error(`error getting reviews ${error.message}`);
          throw error;
        } else {
          return 1;
        }
      }
}

export {
    create,
    update,
    deleteReview,
    getReviewsByBookId,
    getReviewsByUserId,
    getAvgRatingForBook,
};
