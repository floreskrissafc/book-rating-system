const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users')
const db = require('./services/db');

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

db.initTables();

function clientErrorHandler (err, req, res, next) {
  if (!err.statusCode)
    err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
  next();
}

function validateLogin(req, res, next) {
  console.log("req.session.isloggedin: ", req.session.isloggedin)
  if (!req.session.isloggedin) {
    let error = new Error("User not logged-in");
    error.statusCode = 400;
    next(error);
  }
  next()
}

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/users', usersRouter);
app.use(validateLogin);
app.use('/books', booksRouter);

app.use(clientErrorHandler)
app.listen(port, () => {
  console.log(`Book Rating System Server listening at http://localhost:${port}`);
});
