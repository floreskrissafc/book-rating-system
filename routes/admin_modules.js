const express = require('express');
const modules = require('../services/modules');
const router = express.Router();

/* POST modules */
router.post('/', function(req, res, next) {
    try {
      res.json(modules.create(req.body));
    } catch(err) {
      console.error(`Error while adding modules `, err.message);
      next(err);
    }
  });

module.exports = router;