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

/** used to chage a password by any user.*/
router.post('/changepassword', async function(req, res, next) {
  try {
    let changeRes = await users.changePassword(req.body);
    return res.json(changeRes);
  } catch (error) {
    logger.error(`reset password error ${error.message}`);
    next(error);
  }
});


router.post('/forgotpassword', async function(req, res, next) {
  try {
    let forgotRes = await users.sendResetEmail(req.body);
    return res.json(forgotRes);
  } catch (error) {
    logger.error(`forgot password error ${error.message}`);
    next(error);
  }
});

router.get('/resetpassword_ui/:token', async(req, res) => {
  res.redirect(`/pages/reset_password.html?token=${req.params.token}`);
});

// Verify Token and Reset Password (Step 2)
router.post('/resetpassword/:token', async (req, res, next) => {
  try {
      const token = req.params.token;
      const { newPassword } = req.body;
      return res.json(await users.resetPassword(token, newPassword));
  } catch (error) {
    logger.error(`reset password error ${error.message}`);
    next(error);
  }
});


export default router;