const sqlite = require('better-sqlite3');
const config = require('../config.js')
const fs = require('fs');
const path = require('path');
const db = new sqlite(path.resolve(config.DB_NAME), {fileMustExist: true});

function initTables() {
  fs.readdirSync(path.resolve("schemas")).forEach(file => {
    const schema = fs.readFileSync(path.resolve(`schemas/${file}`), 'utf8');
    console.log(schema)
    db.exec(schema)
  });
}

function queryAll(sql, params) {
  console.log("db query:", sql, params)
  return db.prepare(sql).all(params);
}

function run(sql, params) {
  console.log("db run:", sql, params)
  return db.prepare(sql).run(params);
}

function queryOne(sql, params) {
  console.log("queryOne: ", sql, params)
  return db.prepare(sql).get(params);
}

module.exports = {
  queryAll,
  queryOne,
  run,
  initTables,
}
