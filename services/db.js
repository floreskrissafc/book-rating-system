import sqlite from 'better-sqlite3';
import config from '../config.js';
import fs from 'fs';
import path from 'path';
const db = new sqlite(path.resolve(config.DB_NAME), {fileMustExist: true});
import logger from '../services/logging.js';

function initTables() {
  fs.readdirSync(path.resolve("schemas")).forEach(file => {
    const schema = fs.readFileSync(path.resolve(`schemas/${file}`), 'utf8');
    logger.info(schema);
    db.exec(schema);
  });
}

function queryAll(sql, params) {
  logger.info("db query:", sql, params);
  return db.prepare(sql).all(params);
}

function run(sql, params) {
  logger.info("db run:", sql, params);
  return db.prepare(sql).run(params);
}

function queryOne(sql, params) {
  logger.info("queryOne: ", sql, params);
  return db.prepare(sql).get(params);
}

export {
  queryAll,
  queryOne,
  run,
  initTables,
};
