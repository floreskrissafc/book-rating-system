const db = require('./db');
const config = require('../config');
const moduleService = require('./modules');

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
  
  if (!book.module_name) {
    messages.push('module name  is empty');
  }

  moduleObj = moduleService.getModuleByName(book.module_name);
  if (moduleObj == undefined) {
    messages.push(`Module by name: ${book.module_name} not found`);
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
  return moduleObj;
}

function getBooksByModule(module_id) {
  const module_book_ids = db.queryAll(`SELECT * from modules_books WHERE module_id = ?`, module_id);
  return module_book_ids.map(module_book_id => (db.queryOne(`SELECT * FROM books WHERE id = ?`, module_book_id.book_id)));
}

function create(bookObj) {
  moduleObj = validateCreate(bookObj);
  const {isbn, title, authors} = bookObj;
  const bookInsertResult = db.run('INSERT INTO books (isbn, title, authors) VALUES (@isbn, @title, @authors)', {isbn, title, authors});
  
  if (!bookInsertResult.changes) {
    let error = new Error('Error in creating book');
    error.statusCode = 400;
    throw error;
  }

  book_id = bookInsertResult.lastInsertRowid;
  module_id = moduleObj.id;
  const modulesBooksInsertResult = db.run('INSERT INTO modules_books (book_id, module_id) VALUES (@book_id, @module_id)', {book_id, module_id});
  if (!modulesBooksInsertResult.changes) {
    let error = new Error('Error in linking module and book');
    error.statusCode = 400;
    throw error;
  }

  let message = 'Book created successfully';
  return {message};
}

module.exports = {
  getMultiple,
  create,
  searchByAuthors,
  searchByTitle,
  getBooksByModule,
}
