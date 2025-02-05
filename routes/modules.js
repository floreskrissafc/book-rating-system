const express = require('express');
const router = express.Router();
const modules = require('../services/modules');

/* GET modules listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(modules.getMultiple(req.query.page));
  } catch(err) {
    console.error(`Error while getting modules `, err.message);
    next(err);
  }
});

module.exports = router;