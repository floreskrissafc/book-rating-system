const db = require('./db');
const config = require('../config');
const usersService = require('../services/users');

const {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} = require('obscenity');

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
        let error = new Error(messages.join('\n'));
        error.statusCode = 400;
        throw error;
    }
}

function getReviewsByBookId(book_id) {
    if (!book_id) {
        let error = new Error(`no book_id present`);
        error.statusCode = 400;
        throw(error);
    }
    let data = db.queryAll(`SELECT * FROM reviews WHERE book_id = ?`, [book_id]);
    if (!data || !data.length) {
        let error = new Error(`There are no reviews for this book yet. Be the first to write a review and share your thoughts with other students`);
        error.statusCode = 400;
        throw(error);
    }

    data = data.map((review) => {
        user = usersService.getUserInfoByID(review.user_id);
        return { ...review, ...user};
    });
    

    return {
        data
    }
}

function create(reviewBody) {
    validateReview(reviewBody)
    const { book_id, user_id, comment, rating } = reviewBody;
    console.log(book_id, user_id, comment, rating);
    const result = db.run('INSERT OR REPLACE INTO reviews (book_id, user_id, comment, rating) VALUES (@book_id, @user_id, @comment, @rating)', {book_id, user_id, comment, rating});
    let message = 'Error in creating user';
    if (result.changes) {
      message = "Your review has been processed successfully";
    }

    return { message };
}

module.exports = {
    create,
    getReviewsByBookId,
};
