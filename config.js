// eslint-disable-next-line no-undef
const env = process.env;

const config = {
  listPerPage: env.LIST_PER_PAGE || 10,
  USER_LIST_PER_PAGE: 10,
  DB_NAME: 'book_rating_system.db',
  SESSION_SECRET: '7736e77dc3e25e0b7d908865fc3f18fe8fe486ee',
  BCRYPT_SALT: 10,
  PASSWORD_MIN_LENGTH: 10,
  COMMENT_CHAR_MAX_LENGTH: 256,
  VALID_EMAIL_DOMAINS: [
    "london.ac.uk",
    "student.london.ac.uk"
  ],
  DEFAULT_PROFILE_PICTURE: "../imgs/user_profiles/default_profile.png", 
  PROFILE_UPLOAD_NAME: "profile_pic_input",
  BOOK_UPLOAD_NAME: "book_pic_input",
};

export default config;