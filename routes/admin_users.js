import express from 'express';
const router = express.Router();
import * as users from '../services/users.js';
import logger from '../services/logging.js';

/** amdmin only route to delete a user. */
router.delete('/', function(req, res, next) {
    try {
        // NOTE: this will also delete other foreign key referred child table rows like reviews etc.
        res.json(users.deleteUser(req.body, req.session.user));
    } catch (error) {
        logger.error(`Error deleting user`, error.message);
        next(error);
    }
});

export default router;