const db = require('./db');
const config = require('../config');
const Err = require('./customError');

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

  if (!module || !module.module_code || !module.name) {
    messages.push('Either Module code or module name, or both are not entered');
  }
  
  if (messages.length) {
    let errorset = new Set(messages);
    let error = new Error([...errorset].join());
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

  let message = "Your review has been updated successfully";
  return { message };
}

function deleteModule(moduleObj) {
  let { module_name } = moduleObj;
  if (!module_name) {
    throw new Err("No module is selected", 400);
  }

  moduleObj = getModuleByName(module_name);
  if (moduleObj == undefined) {
    throw new Err(`Module by name: ${module_name} not found`, 400);
  }

  let { id } = moduleObj;

  const result = db.run('DELETE FROM modules WHERE id = @id', {id});
  if (!result.changes) {
    throw new Err("Error deleting module", 400);
  }

  let message = "Your review has been deleted successfully";
  return { message };
}

module.exports = {
  getMultiple,
  create,
  getModuleByName,
  update,
  deleteModule,
}
