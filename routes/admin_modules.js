import express from 'express';
import * as modules from '../services/modules.js';
import Err from '../services/customError.js';
const router = express.Router();
import logger from '../services/logging.js';

/* admin only route to create a new module. */
router.post('/', function(req, res, next) {
    try {
      res.json(modules.create(req.body));
    } catch(err) {
      if (err.message.toLowerCase().includes('unique constraint failed')) {
        next(new Err("Either Module code or module already exists in the system", 400));
      } else {
        logger.error(`Error while adding modules `, err.message);
        next(err);
      }
    }
});

/** admin only route to update a module. */
router.post('/update', function(req, res, next) {
  try {
    res.json(modules.update(req.body));
  } catch (error) {
    logger.error('Error while deleting module', error.message);
    next(error);
  }
});

/** admin only route to delete a module. */
router.delete('/', function(req, res, next) {
  try {
    res.json(modules.deleteModule(req.body));
  } catch (error) {
    logger.error('Error while deleting module', error.message);
    next(error);
  }
});

export default router;