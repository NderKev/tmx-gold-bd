'use strict';

const express  = require('express');
const router  = express.Router();
const {authenticator} = require('../lib/common');
const path = require('path');
//const authController = require('../controllers/auth');
const url = require('url');
const checkUser = require('../middleware/checkUser');
const auth = require('../middleware/auth');

router.get('/profile/:id',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  //req.body.customer = req.params.
  //const response = await userController.fetchUser(req.body)
  res.sendFile(path.join(__dirname, '../public' , 'index-dashboard.html'));
});

router.get('/profile/:id/trade',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-trading-view.html'));
});

router.get('/profile/:id/user',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-ico-user.html'));
});

router.get('/profile/:id/buy',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'buy-and-sell.html'));
});

router.get('/profile/:id/affiliate',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , '/affailite-program.html'));
});

router.get('/profile/:id/wallet',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'my-wallet.html'));
});


router.get('/profile/:id/security',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'security.html'));
});

router.get('/profile/:id/account',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'account-confirmation.html'));
});

router.get('/profile/:id/settings',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'settings.html'));
});

router.get('/profile/:id/faq',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-faq.html'));
});

router.get('/profile/:id/support',  authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-support.html'));
});


router.get('/profile/:id/profile',   authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-profile.html'));
});

module.exports = router;