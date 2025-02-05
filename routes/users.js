const express = require('express')
const router = express.Router();
const users = require('../services/users');

router.get('/register', function(req, res, next) {
  try {
    res.json(users.getAllUsers(req.query.page));
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    let registerRes = await users.register(req.body);
    console.log("registerRes: ", registerRes);
    res.json(registerRes)
  } catch (err) {
    console.error(`Error while registering user`, err.message);
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
    console.error(`login error`, err.message);
    next(err);
  }
});

router.get('/logout', async function (req, res, next) {
  req.session.destroy();
  res.json({message: "user logged out succesfully"});
});

router.post('/resetpassword', async function(req, res, next) {
  try {
    let resetRes = await users.resetPassword(req.body);
    res.json(resetRes);
  } catch (error) {
    console.error(`login error`, error.message);
    next(error);
  }
});

module.exports = router