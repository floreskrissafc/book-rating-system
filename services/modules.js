const db = require('./db');
const config = require('../config');

function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.queryAll(`SELECT * FROM modules LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

function getModuleByName(module_name) {
  return db.queryOne(`SELECT * FROM modules WHERE name = ?`, module_name);
}

function validateCreate(module) {
  let messages = [];

  console.log(module);

  if (!module) {
    messages.push('No object is provided');
  }

  if (!module.module_code) {
    messages.push('No module_code is provided');
  }

  if (!module.name) {
    messages.push('No module name is empty');
  }

  
  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
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

module.exports = {
  getMultiple,
  create,
  getModuleByName,
}
