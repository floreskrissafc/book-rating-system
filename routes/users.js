import express from 'express';
import * as users from '../services/users.js';
import logger from '../services/logging.js';

const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    res.json(users.getAllUsers(req.query.page));
  } catch (err) {
    logger.error(`Error while getting users`, err.message);
    next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    let registerRes = await users.register(req.body);
    logger.info("registerRes: ", registerRes);
    res.json(registerRes);
  } catch (err) {
    logger.error(`Error while registering user`, err.message);
    next(err);
  }
});

router.post('/login', async function(req, res, next) {
  try {
    let respObj = await users.login(req.body);
    req.session.isloggedin = true;
    req.session.user = respObj.user;
    res.json(respObj);
  } catch (err) {
    logger.error(`login error`, err.message);
    next(err);
  }
});

router.get('/logout', async function(req, res) {
  req.session.destroy();
  res.json({message: "user logged out succesfully"});
});

router.post('/resetpassword', async function(req, res, next) {
  try {
    let resetRes = await users.resetPassword(req.body);
    res.json(resetRes);
  } catch (error) {
    logger.error(`login error`, error.message);
    next(error);
  }
});

export default router;