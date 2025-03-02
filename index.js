import express from 'express';
import { join } from 'path';
import path from 'path';
import session from 'express-session';
import booksRouter from './routes/books.js';
import adminBooksRouter from './routes/admin_books.js';
import usersRouter from './routes/users.js';
import modulesRouter from './routes/modules.js';
import adminModulesRouter from './routes/admin_modules.js';
import adminUsersRouter from './routes/admin_users.js';
import homeRouter from './routes/home.js';
import reviewsRouter from './routes/reviews.js';
import { initTables } from './services/db.js';
import logger from './services/logging.js';
import config from './config.js';

const __dirname = path.resolve();
const app = express();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
	secret: config.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(join(__dirname)));

// initialize the sql database with tables and some primitive data.
initTables();

/**
 * Handles client-side errors.
 *
 * This middleware function catches errors that occur during request processing
 *  and send an appropriate JSON error response to the client.
 *
 * @param {Err} err - The error object from services/customError.js.
 * If it doesn't have a statusCode, it defaults to 500 (Internal Server Error).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
function clientErrorHandler (err, req, res, next) {
  if (!err.statusCode)
    err.statusCode = 404;
  res.status(err.statusCode).json({ error: err.message });
  next();
}

/**
 * Handle users login validation.
 * 
 * This middleware function handles user validation 
 * and maintains the session for guard against 
 * unauthorized user functionality access.
 * 
 * @param {obect} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @returns the call to next function.
 */
function validateLogin(req, res, next) {
  logger.info("req.session.isloggedin: ", req.session.isloggedin);
  if (!req.session.isloggedin) {
    let error = new Error("User not logged-in");
    error.statusCode = 401;
    return next(error);
  } else {
    res.set('IS-ADMIN', req.session.user.role);
  }
  next();
}

/**
 * 
 * Handle admin validation.
 * 
 * This middleware function handles admin validation 
 * and maintains the session to guard against 
 * unauthorized access to admin functionalities.
 * 
 * @param {obect} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
function validateAdmin(req, res, next) {
  logger.info("req.session.user", req.session.user, req.session.user.role, !req.session.user.role);
  if (!req.session.user.role) {
    let error = new Error("User not Admin");
    error.statusCode = 401;
    next(error);
  }
  next();
}

/**
 * renders the main landing page.
 */
app.get('/', (req, res) => {
  res.render('index.html');
});

app.use('/users', usersRouter);

// Access to all the endpoints below should have users already validated via login.
app.use(validateLogin);

app.get('/user', (req, res) => {
  return res.json(req.session.user);
});

app.use('/books', booksRouter);
app.use('/modules', modulesRouter);
app.use('/home', homeRouter);
app.use('/reviews', reviewsRouter);

// Access to all the endpoints below should have users already validated via login and users need to be an admin.
app.use(validateAdmin);
app.use('/books', adminBooksRouter);
app.use('/modules', adminModulesRouter);
app.use('/users', adminUsersRouter);
app.use(clientErrorHandler);

// start listening for requests the server.
app.listen(port, () => {
  logger.info(`Book Rating System Server listening at http://localhost:${port}`);
});
