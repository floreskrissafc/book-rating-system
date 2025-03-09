import * as db from './db.js';
import config from '../config.js';
import Err from './customError.js';

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM modules LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  };
}

function getAllModuleByName(module_name) {
  return db.queryAll(`SELECT * FROM modules WHERE name = ?`, module_name);
}

function getModuleById(module_id) {
  return db.queryOne(`SELECT * FROM modules WHERE id = ?`, module_id);
}

function validateCreate(module) {
  if (!module || !module.module_code || !module.name) {
    throw new Err(`Either Module code or module name, or both are not entered`, 401);
  }
}

function create(moduleObj) {
  validateCreate(moduleObj);
  const {module_code, name} = moduleObj;
  const result = db.run('INSERT INTO modules (module_code, name) VALUES (@module_code, @name)', {module_code, name});
  
  let message = 'Error in creating module';
  if (result.changes) {
    message = 'Module created successfully';
  }

  return {message};
}

function update(moduleObj) {
  let { module_code, module_name, module_id } = moduleObj;
  if (!module_id) {
    throw new Err("No module id is selected", 400);
  }
  if (!module_code || !module_name) {
    throw new Err('Either Module code or module name, or both are empty', 400);
  }

  const result = db.run('UPDATE modules SET module_code=@module_code, name=@module_name WHERE id=@module_id', {module_code, module_name, module_id});
  if (!result.changes) {
   throw new Err('Error updating module', 400);
  }

  let message = "Your module has been updated successfully";
  return { message };
}

function deleteModule(moduleObj) {
  let { module_id } = moduleObj;
  let id = module_id;
  
  const result = db.run('DELETE FROM modules WHERE id = @id', {id});
  if (!result.changes) {
    throw new Err("Error deleting module", 400);
  }

  let message = "Your module has been deleted successfully";
  return { message };
}

function addBook(data) {
  const { book_id, module_id } = data;
  if (!book_id) {
    throw new Err(`missing book_id to add to module`, 400);
  }

  if (!module_id) {
    throw new Err(`missing module_id to add a book to`, 400);
  }

  const modulesBooksInsertResult = db.run('INSERT INTO modules_books (book_id, module_id) VALUES (@book_id, @module_id)', {book_id, module_id});
  if (!modulesBooksInsertResult.changes) {
    throw new Err('Error in linking module and book', 400);
  }

  let message = `The book id: ${book_id} is going to be added to module id: ${module_id}`;
  return {message};
}

function removeBook(data) {
  const { book_id, module_id } = data;
  if (!book_id) {
    throw new Err(`missing book_id to add to module`, 400);
  }

  if (!module_id) {
    throw new Err(`missing module_id to add a book to`, 400);
  }

  const modulesBooksDeleteResult = db.run('DELETE FROM modules_books WHERE book_id = @book_id AND module_id = @module_id', {book_id, module_id});
  if (!modulesBooksDeleteResult.changes) {
    throw new Err('Error in linking module and book', 400);
  }

  let message = `The book id: ${book_id} is going to be deleted from module id: ${module_id}`;
  return {message};
}

export {
  getMultiple,
  create,
  getAllModuleByName,
  update,
  deleteModule,
  getModuleById,
  addBook,
  removeBook,
};
