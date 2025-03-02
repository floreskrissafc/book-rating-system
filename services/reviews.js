import * as db from './db.js';
import config from '../config.js';
import * as usersService from '../services/users.js';
import * as booksService from '../services/books.js';
import Err from '../services/customError.js';

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

function getReviewsByBookId(book_id) {
    if (!book_id) {
        throw new Err(`no book_id present`, 404);
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE book_id = ?`, [book_id]);
    if (!data || !data.length) {
        throw new Err(`There are no reviews for this book yet. Be the first to write a review and share your thoughts with other students`, 404);
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

export {
    create,
    deleteReview,
    getReviewsByBookId,
    getReviewsByUserId,
};
