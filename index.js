const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users')
const db = require('./services/db');

app.use(express.json());

db.initTables();

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/books', booksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
