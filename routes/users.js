import express from 'express';
import * as users from '../services/users.js';
import logger from '../services/logging.js';

const router = express.Router();

/** get a list of all users. */
router.get('/', function(req, res, next) {
  try {
    res.json(users.getAllUsers(req.query.page));
  } catch (err) {
    logger.error(`Error while getting users ${err.message}`);
    next(err);
  }
});

/** register a new user */
router.post('/register', async function(req, res, next) {
  try {
    let registerRes = await users.register(req.body);
    logger.info(`registerRes: ${JSON.stringify(registerRes, null, 4)}`);
    res.json(registerRes);
  } catch (err) {
    logger.error(`Error while registering user ${err.message}`);
    next(err);
  }
});

/** login an existing user. */
router.post('/login', async function(req, res, next) {
  try {
    let respObj = await users.login(req.body);
    delete respObj.user.password_hash;
    req.session.isloggedin = true;
    req.session.user = respObj.user;
    res.json(respObj);
  } catch (err) {
    logger.error(`login error ${err.message}`);
    next(err);
  }
});

/** log out an existing logged in user. */
router.get('/logout', async function(req, res) {
  req.session.destroy();
  res.json({message: "user logged out succesfully"});
});

/** used to reset a forgotten password by any user.
 * NOTE: this is not resetting a password by an admin.
*/
router.post('/resetpassword', async function(req, res, next) {
  try {
    let resetRes = await users.resetPassword(req.body);
    res.json(resetRes);
  } catch (error) {
    logger.error(`reset password error ${error.message}`);
    next(error);
  }
});

export default router;