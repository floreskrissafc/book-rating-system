const express = require('express');
const router = express.Router();
const users = require('../services/users');

router.delete('/', function(req, res, next) {
    try {
        // NOTE: this will also delete other foreign key referred child table rows like reviews etc.
        res.json(users.deleteUser(req.body, req.session.user));
    } catch (error) {
        console.error(`Error deleting user`, error.message);
        next(error);
    }
});

module.exports = router;