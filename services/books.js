import * as db from './db.js';
import * as moduleService from './modules.js';
import * as reviewService from './reviews.js';
import * as ISBNValidator from 'isbn3';
import Err from './customError.js';
import logger from '../services/logging.js';
import config from '../config.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Get a paginated list of books from the sqlite db.
 *
 * @param {number} The page number to retrieve. Defaults to 1 if not provided.
 * @returns {object} An object containing the paginated data and metadata.
 */
function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM books LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  };
}

/**
 * Searches for books in the database based on a single column and a query string.
 *
 * @param {string} column The name of the column to search in.
 * @param {string} query The search string to look for within the specified column.
 * @returns {object} An object containing the search results.
 */
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

  return { isbn: isbn13h};
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
  const books = module_book_ids.map(module_book_id => (db.queryOne(`SELECT * FROM books WHERE id = ?`, module_book_id.book_id)));
  const res = books.map((book) => ({
    ...book,
    rating: reviewService.getAvgRatingForBook(book.id)
  }));
  return res;
}

function getBookInfoByID(book_id) {
  return db.queryOne(`select * FROM books WHERE id = ?`, book_id);
}

async function create(bookObj) {
  // Below is module fields + isbn with isbn13 normalized formatting.
  let { isbn } = validateCreate(bookObj);
  let { title, authors, edition, link, cover_picture } = bookObj;
  if (!cover_picture || cover_picture.length <= 0) {
    cover_picture = config.DEFAULT_BOOK_COVER;
  }
  const bookInsertResult = db.run('INSERT INTO books (isbn, title, authors, edition, link, cover_picture) VALUES (@isbn, @title, @authors, @edition, @link, @cover_picture)', {isbn, title, authors, edition, link, cover_picture});
  if (!bookInsertResult.changes) {
    throw new Err('Error in creating book', 400);
  }
  let book_id = bookInsertResult.lastInsertRowid;
  let message = `The book ${title} is going to be added with id: ${book_id}.`;
  return {message};
}

function validateUpdate(book) {
  if (!book) {
    throw new Err('No object is provided', 400);
  }

  if (!book.id) {
    throw new Err('Some fields are empty: id', 400);
  }

  return book;
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
  let { id } = validateUpdate(bookObj);
  const { title, authors, cover_picture, link, edition, isbn } = bookObj;
  const { data } = searchBySingleColumnQuery("id", id);
  if (!data || data.length != 1) {
    throw new Err(`Book for id: ${id} not found`, 404);
  }
  let book_id = data[0].id;
  let updates = [];
  if (title && data[0].title != title) {
    updates.push(await updateBooksField(book_id, 'title', title));
  }

  if (authors && data[0].authors != authors) {
    updates.push(await updateBooksField(book_id, 'authors', authors));
  }

  if (link && data[0].link != link) {
    updates.push(await updateBooksField(book_id, 'link', link));
  }

  if (edition && data[0].edition != edition) {
    updates.push(await updateBooksField(book_id, 'edition', edition));
  }

  if (isbn) {
    let isbnValidationRes = ISBNValidator.parse(isbn);

    if (!isbnValidationRes || !isbnValidationRes.isValid || !isbnValidationRes.isbn13h) {
      throw new Err('ISBN does not match any known format', 400);
    }
    let isbn13h = isbnValidationRes.isbn13h;
    if (data[0].isbn != isbn13h) {
      updates.push(await updateBooksField(book_id, 'isbn', isbn13h));
    }
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

  let message = `The book has been updated.`;
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

  if (!proposedBookObj.module_id) {
    throw new Err('The module id is not selected', 400);
  }

  const moduleObj = moduleService.getModuleById(proposedBookObj.module_id);
  if (moduleObj == undefined) {
    throw new Err(`Module by id: ${proposedBookObj.module_id} not found`, 400);
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
  let data = db.queryAll(`SELECT * FROM proposed_books LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  data = data.map(each => {
    let module = moduleService.getModuleById(each.module_id);
    return { ...each, name: module.name };
  });

  return {
    data,
    meta
  };
}

function deleteProposedBook(bookObj) {
  let { id } = bookObj;
  const result = db.run('DELETE FROM proposed_books WHERE id = @id', {id});
  if (!result.changes) {
    throw new Err("Error deleting proposed book", 400);
  }

  let message = "proposed book has been deleted successfully";
  return { message };
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
    throw new Err("Error deleting book", 400);
  }

  let message = "Your book has been deleted successfully";
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
  deleteProposedBook,
};
