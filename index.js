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

const __dirname = path.resolve();
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(join(__dirname)));

initTables();

function clientErrorHandler (err, req, res, next) {
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
  next();
}

function validateLogin(req, res, next) {
  logger.info("req.session.isloggedin: ", req.session.isloggedin);
  if (!req.session.isloggedin) {
    let error = new Error("User not logged-in");
    error.statusCode = 400;
    return next(error);
  } else {
    res.set('IS-ADMIN', req.session.user.role);
  }
  next();
}

function validateAdmin(req, res, next) {
  logger.info("req.session.user", req.session.user, req.session.user.role, !req.session.user.role);
  if (!req.session.user.role) {
    let error = new Error("User not Admin");
    error.statusCode = 400;
    next(error);
  }
  next();
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.use('/users', usersRouter);
app.use(validateLogin);
app.use('/books', booksRouter);
app.use('/modules', modulesRouter);
app.use('/home', homeRouter);
app.use('/reviews', reviewsRouter);
app.use(validateAdmin);
app.use('/books', adminBooksRouter);
app.use('/modules', adminModulesRouter);
app.use('/users', adminUsersRouter);

app.use(clientErrorHandler);
app.listen(port, () => {
  logger.info(`Book Rating System Server listening at http://localhost:${port}`);
});
