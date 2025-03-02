import express from 'express';
const router = express.Router();
import * as modules from '../services/modules.js';
import * as books from '../services/books.js';
import logger from '../services/logging.js';

router.get('/', function (req, res, next) {
    try {
        let modulesRes = modules.getMultiple(req.query.page);
        let data = [];
        modulesRes.data.forEach(module => {
            data.push({
                ...module,
                books: books.getBooksByModule(module.id)
            });
            logger.info('module: \n', data);
        });
        const meta = modulesRes.meta;
        return res.json({data, meta}); 
    } catch (error) {
        logger.error(`Error while getting homepage `, error.message);
        next(error);
    }

});

export default router;