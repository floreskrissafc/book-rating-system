// eslint-disable-next-line no-undef
const env = process.env;

const config = {
  listPerPage: env.LIST_PER_PAGE || 10,
  USER_LIST_PER_PAGE: 10,
  DB_NAME: 'book_rating_system.db',
  SESSION_SECRET: '7736e77dc3e25e0b7d908865fc3f18fe8fe486ee',
  BCRYPT_SALT: 10,
  PASSWORD_MIN_LENGTH: 10,
  COMMENT_CHAR_MAX_LENGTH: 2048,
  VALID_EMAIL_DOMAINS: [
    "london.ac.uk",
    "student.london.ac.uk",
  ],
  DEFAULT_PROFILE_PICTURE: "imgs/user_profiles/default_profile.png", 
  DEFAULT_BOOK_COVER: "imgs/books_cover/default_book_cover.jpg",
  PROFILE_UPLOAD_NAME: "profile_pic_input",
  BOOK_UPLOAD_NAME: "book_pic_input",
  EMAIL_USER: "bookratingsystemuol@flomedspa.com",
  EMAIL_PASSWORD: env.EMAIL_PASSWORD,
  JWT_SECRET: '6646d66ed2f14e0b7d908ghjghsadfa3f18f87uhjk8t7qw6ee',
  RESET_TIME: '15m',
  // free domain key with mailtrap
  // MAILTRAP_API_KEY: "088ba9680c625544780d73679b9bd0a9"
  // flomedspa.com domain key.
  MAILTRAP_API_KEY: "344920d123b92eb25ea11dec90327cd9",
};

export default config;