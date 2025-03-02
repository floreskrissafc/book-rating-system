import express from 'express';
const router = express.Router();
import * as modules from '../services/modules.js';
import * as books from '../services/books.js';
import logger from '../services/logging.js';

/** route to fill render data for home page
 * 
 * {
    "data": [
        {
            "id": 2,
            "module_code": "mc2",
            "name": "module2",
            "books": [
                {
                    "id": 2,
                    "ISBN": "978-5-904790-09-7",
                    "title": "title2",
                    "edition": null,
                    "authors": "author2",
                    "link": null,
                    "cover_picture": null,
                    "rating": 0
                }
            ]
        },
        {
            "id": 3,
            "module_code": "mc3",
            "name": "module3",
            "books": []
        },
    ],
    "meta": {
        "page": 1
    }
}
 * 
 */
router.get('/', function (req, res, next) {
    try {
        let modulesRes = modules.getMultiple(req.query.page);
        let data = [];
        modulesRes.data.forEach(module => {
            data.push({
                ...module,
                books: books.getBooksByModule(module.id)
            });
            logger.info(`module: ${JSON.stringify(data, null, 4)}`);
        });
        const meta = modulesRes.meta;
        return res.json({data, meta}); 
    } catch (error) {
        logger.error(`Error while getting homepage ${error.message}`);
        next(error);
    }

});

export default router;