const express = require('express');
const router = express.Router();
const modules = require('../services/modules');
const books = require('../services/books');

router.get('/', function (req, res, next) {
    try {
        let modulesRes = modules.getMultiple(req.query.page);
        let data = [];
        modulesRes.data.forEach(module => {
            data.push({
                ...module,
                books: books.getBooksByModule(module.id)
            });
            console.log('module: \n', data);
        });
        meta = modulesRes.meta;
        return res.json({data, meta}); 
    } catch (error) {
        console.error(`Error while getting homepage `, error.message);
        next(error);
    }

});

module.exports = router;