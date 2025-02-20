const express = require('express');
const modules = require('../services/modules');
const Err = require('../services/customError');
const router = express.Router();

/* POST modules */
router.post('/', function(req, res, next) {
    try {
      res.json(modules.create(req.body));
    } catch(err) {
      if (err.message.toLowerCase().includes('unique constraint failed')) {
        next(new Err("Either Module code or module already exists in the system", 400));
      } else {
        console.error(`Error while adding modules `, err.message);
        next(err);
      }
    }
});

router.post('/update', function(req, res, next) {
  try {
    res.json(modules.update(req.body));
  } catch (error) {
    console.error('Error while deleting module', error.message);
    next(err);
  }
});

router.delete('/', function(req, res, next) {
  try {
    res.json(modules.deleteModule(req.body));
  } catch (error) {
    console.error('Error while deleting module', error.message);
    next(error);
  }
});

module.exports = router;