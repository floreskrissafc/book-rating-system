import express from 'express';
const router = express.Router();
import * as users from '../services/users.js';
import logger from '../services/logging.js';
import config from '../config.js';

import multer from 'multer';
import mime from 'mime-types';
const storage = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, 'imgs/user_profiles');
  },
  filename: function (req, file, next) {
    next(null, `${req.session.user.id}-${Date.now()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({ storage: storage });

/** update a user profile to allow changing user's first name, last name and profile photo. */
router.post('/update', upload.single(config.PROFILE_UPLOAD_NAME), async function(req, res, next) {
    try {
      if (req.file) {
        req.body.profile_picture = req.file.path;
      }
      req.body.email = req.session.user.email;
      let updateUser = await users.update(req.body);
      req.session.user = updateUser;
      return res.json(updateUser);
    } catch (error) {
      logger.error(`Error while updating user ${error.message}`);
      next(error);
    }
});

export default router;