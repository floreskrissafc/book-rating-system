import * as db from './db.js';
import * as moduleService from './modules.js';
import * as ISBNValidator from 'isbn3';
import Err from './customError.js';
import logger from '../services/logging.js';
import config from '../config.js';
import fs from 'fs/promises';
import path from 'path';

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM books LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  };
}

function searchBySingleColumnQuery(column, query) {
  const data = db.queryAll(`SELECT * FROM books WHERE ${column} LIKE ?`, [`%${query.toLowerCase()}%`]);
  return {
    data
  };
}

function validateCreate(book) {
  if (!book) {
    throw new Err('No object is provided', 400);
  }

  if (!book.module_name) {
    throw new Err('Module name is not selected', 400);
  }

  if (!book.isbn) {
    throw new Err('Some fields are empty: isbn', 400);
  }

  let isbnValidationRes = ISBNValidator.parse(book.isbn);

  if (!isbnValidationRes || !isbnValidationRes.isValid || !isbnValidationRes.isbn13h) {
    throw new Err('ISBN does not match any known format', 400);
  }
  let isbn13h = isbnValidationRes.isbn13h;

  if (!book.title) {
    throw new Err('Some fields are empty: title', 400);
  }

  if (!book.authors) {
    throw new Err('Some fields are empty: authors', 400);
  }

  let moduleObj = moduleService.getModuleByName(book.module_name);
  if (moduleObj == undefined) {
    throw new Err(`Module by name: ${book.module_name} not found`, 400);
  }

  return { ...moduleObj, isbn: isbn13h};
}

function getBooksByModulesIds(module_ids) {
  let module_book_map = {};
  module_ids.forEach(module_id => {
    module_book_map[module_id] = getBooksByModule(module_id);
  });
  return module_book_map;
}

function getBooksByModule(module_id) {
  const module_book_ids = db.queryAll(`SELECT * from modules_books WHERE module_id = ?`, module_id);
  return module_book_ids.map(module_book_id => (db.queryOne(`SELECT * FROM books WHERE id = ?`, module_book_id.book_id)));
}

function getBookInfoByID(book_id) {
  return db.queryOne(`select * FROM books WHERE id = ?`, book_id);
}

function create(bookObj) {
  // Below is module fields + isbn with isbn13 normalized formatting.
  let { id, name, module_code, isbn } = validateCreate(bookObj);
  const { title, authors} = bookObj;

  const { data } = searchBySingleColumnQuery("isbn", isbn);
  let book_id;
  if (data && data.length == 1) {
    book_id = data[0].id;
  } else {
    const bookInsertResult = db.run('INSERT INTO books (isbn, title, authors) VALUES (@isbn, @title, @authors)', {isbn, title, authors});
    if (!bookInsertResult.changes) {
      throw new Err('Error in creating book', 400);
    }
    book_id = bookInsertResult.lastInsertRowid;
  }
  const modulesBooksInsertResult = db.run('INSERT INTO modules_books (book_id, module_id) VALUES (@book_id, @id)', {book_id, id});
  if (!modulesBooksInsertResult.changes) {
    throw new Err('Error in linking module and book', 400);
  }

  let message = `The book ${title} is going to be added to module ${name} ${module_code}`;
  return {message};
}

function validateUpdate(book) {
  if (!book) {
    throw new Err('No object is provided', 400);
  }

  if (!book.isbn) {
    throw new Err('Some fields are empty: isbn', 400);
  }

  let isbnValidationRes = ISBNValidator.parse(book.isbn);

  if (!isbnValidationRes || !isbnValidationRes.isValid || !isbnValidationRes.isbn13h) {
    throw new Err('ISBN does not match any known format', 400);
  }
  let isbn13h = isbnValidationRes.isbn13h;
  return { isbn: isbn13h};
}

async function updateBooksField(id, name, value) {
  if (!id) {
      throw new Err(`Invalid Id ${id}`, 500);
  }
  if (!name) {
      throw new Err(`Invalid name ${name}`, 500);
  }
  if (!value) {
      throw new Err(`Invalid value ${value}`, 500);
  }
  const result = db.run(`UPDATE books SET ${name}=@value WHERE id=@id`, {value, id});
  if (!result.changes) {
   throw new Err(`Error updating book ${name}: ${value}`, 500);
  }
  return `updated ${name}: ${value}`;
}

async function update(bookObj) {
  // Below is module fields + isbn with isbn13 normalized formatting.
  let { isbn } = validateUpdate(bookObj);
  const { title, authors, cover_picture } = bookObj;
  const { data } = searchBySingleColumnQuery("isbn", isbn);
  if (!data || data.length != 1) {
    throw new Err(`Book for ISBH: ${isbn} not found`, 404);
  }
  let book_id = data[0].id;
  let updates = [];
  if (title && data[0].title != title) {
    updates.push(await updateBooksField(book_id, 'title', title));
  }

  if (authors && data[0].authors != authors) {
    updates.push(await updateBooksField(book_id, 'authors', authors));
  }

  if (cover_picture && data[0].cover_picture != cover_picture) {
    if (data[0].cover_picture != config.DEFAULT_BOOK_COVER) {
      try {
        await fs.unlink(path.resolve(data[0].cover_picture));
      } catch (error) {
        logger.error(`deleting previous book cover at :${data[0].cover_picture} failed with error: ${error.message}`);
      }
    }
    updates.push(await updateBooksField(book_id, 'cover_picture', cover_picture));
  }

  if (updates.length <= 0) {
    throw new Err("These book details are already stored in the system", 400);
  }

  logger.info(`${updates.join(',')}`);

  let message = `The book ${data[0].title} has been updated with title: ${title} authors: ${authors} cover_picture: ${cover_picture}`;
  return {message};
}

function propose(proposedBookObj) {
  if (!proposedBookObj.title) {
    throw new Err('The book title field is empty', 400);
  }
  const title = proposedBookObj.title;

  if (!proposedBookObj.isbn) {
    throw new Err('The ISBN is not correct', 400);
  }

  const isbnValidationRes = ISBNValidator.parse(proposedBookObj.isbn);
  logger.info(`isbnParseRes: ${JSON.stringify(isbnValidationRes, null, 4)}`, );

  if (!isbnValidationRes || !isbnValidationRes.isValid || !isbnValidationRes.isbn13h) {
    throw new Err('ISBN does not match any known format', 400);
  }
  const isbn13h = isbnValidationRes.isbn13h;

  if (!proposedBookObj.module_name) {
    throw new Err('The module name is not selected', 400);
  }

  const moduleObj = moduleService.getModuleByName(proposedBookObj.module_name);
  if (moduleObj == undefined) {
    throw new Err(`Module by name: ${proposedBookObj.module_name} not found`, 400);
  }

  const module_id = moduleObj.id;

  const proposedBookInsertResult = db.run('INSERT INTO proposed_books (module_id, isbn, title) VALUES (@module_id, @isbn13h, @title)', {module_id, isbn13h, title});
  
  if (!proposedBookInsertResult.changes) {
    throw new Err('Error in creating proposed book', 400);
  }

  // const proposed_book_id = proposedBookInsertResult.lastInsertRowid;
  let message = 'proposal has been submitted';
  return {message};
}

function getProposedMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM proposed_books LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  };
}

function deleteBook(bookObj) {
  let { book_id } = bookObj;
  const book = getBookInfoByID(book_id);
  if (!book) {
    throw new Err(`No book for book_id: ${book_id} found`, 400);
  }
  
  let { id } = book;
  const result = db.run('DELETE FROM books WHERE id = @id', {id});
  if (!result.changes) {
    throw new Err("Error deleting module", 400);
  }

  let message = "Your review has been deleted successfully";
  return { message };
}

export {
  getMultiple,
  create,
  getBooksByModulesIds,
  getBooksByModule,
  searchBySingleColumnQuery,
  getBookInfoByID,
  propose,
  getProposedMultiple,
  update,
  deleteBook,
};
