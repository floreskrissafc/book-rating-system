import * as db from './db.js';
import config from '../config.js';
import * as usersService from '../services/users.js';
import * as booksService from '../services/books.js';
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
    let messages = [];
    const { book_id, user_id, comment, rating } = review;
    if (!book_id) {
        messages.push(`no book_id present`);
    }

    if (!user_id) {
        messages.push(`no user_id present`);
    }

    if (!rating) {
        messages.push(`no rating present`);
    }

    if (comment && comment.length > config.COMMENT_CHAR_MAX_LENGTH) {
        messages.push(`comment length greater than max allowed: ${config.COMMENT_CHAR_MAX_LENGTH}`);
    }

    if (profanity.hasMatch(comment)) {
        messages.push(`please remove offensive words from review`);
    }
    
    if (messages.length) {
        let errorset = new Set(messages);
        let error = new Error([...errorset].join());
        error.statusCode = 400;
        throw error;
    }
}

function getReviewsByBookId(book_id) {
    if (!book_id) {
        let error = new Error(`no book_id present`);
        error.statusCode = 400;
        throw error;
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE book_id = ?`, [book_id]);
    if (!data || !data.length) {
        let error = new Error(`There are no reviews for this book yet. Be the first to write a review and share your thoughts with other students`);
        error.statusCode = 400;
        throw error;
    }

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
        let error = new Error(`no user_id present`);
        error.statusCode = 400;
        throw error;
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
    if (!data || !data.length) {
        let error = new Error(`You have not created any reviews yet`);
        error.statusCode = 400;
        throw error;
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
    logger.info(book_id, user_id, comment, rating);
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

export {
    create,
    deleteReview,
    getReviewsByBookId,
    getReviewsByUserId,
};
