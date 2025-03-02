import express from 'express';
const router = express.Router();
import * as users from '../services/users.js';
import logger from '../services/logging.js';
import multer from 'multer';
import config from '../config.js';
import path from 'path';

import mime from 'mime-types';
const storage = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, 'imgs/user_profiles');
  },
  filename: function (req, file, next) {
    next(null, `${req.session.user.id}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({ storage: storage });

logger.info(`storage: ${JSON.stringify(storage, null, 4)}`);

/** update a  */
router.post('/update', upload.single(config.PROFILE_UPLOAD_NAME), async function(req, res, next) {
    try {
      if (req.file) {
        req.body.profile_picture = path.resolve(req.file.path);
      }
      req.body.email = req.session.user.email;
      let updateRes = await users.update(req.body);
      return res.json(updateRes);
    } catch (error) {
      logger.error(`Error while updating user ${error.message}`);
      next(error);
    }
});

export default router;