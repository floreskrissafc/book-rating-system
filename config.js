const env = process.env;

const config = {
  listPerPage: env.LIST_PER_PAGE || 10,
  USER_LIST_PER_PAGE: 10,
  DB_NAME: 'book_rating_system.db',
  BCRYPT_SALT: 10,
  PASSWORD_MIN_LENGTH: 10,
  COMMENT_CHAR_MAX_LENGTH: 256,
}

module.exports = config;
