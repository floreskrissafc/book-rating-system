const db = require('./db');
const config = require('../config');
const { search } = require('../routes/books');

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM books LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

function searchByAuthors(authorQuery) {
  const data = db.queryAll(`SELECT * FROM books WHERE authors LIKE ?`, [`%${authorQuery.toLowerCase()}%`])
  return {
    data
  }
}

function searchByTitle(titleQuery) {
  const data = db.queryAll(`SELECT * FROM books WHERE title LIKE ?`, [`%${titleQuery.toLowerCase()}%`])
  return {
    data
  }
}

function validateCreate(book) {
  let messages = [];

  console.log(book);

  if (!book) {
    messages.push('No object is provided');
  }

  if (!book.isbn) {
    messages.push('No ISBN is provided');
  }

  if (!book.title) {
    messages.push('Title is empty');
  }

  if (!book.authors) {
    messages.push('Authors is empty');
  }
  
  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

function create(bookObj) {
  validateCreate(bookObj);
  const {isbn, title, authors} = bookObj;
  const result = db.run('INSERT INTO books (isbn, title, authors) VALUES (@isbn, @title, @authors)', {isbn, title, authors});
  
  let message = 'Error in creating book';
  if (result.changes) {
    message = 'Book created successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  searchByAuthors,
  searchByTitle,
}
