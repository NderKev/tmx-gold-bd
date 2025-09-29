'use strict';

const express  = require('express');
const router  = express.Router();
const {authenticator} = require('../lib/common');
const path = require('path');
//const authController = require('../controllers/auth');
const url = require('url');
const checkAdmin = require('../middleware/checkAdmin');
const auth = require('../middleware/auth');

router.get('/profile/:id',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, "../public/index-dashboard.html"));
});

router.get('/profile/:id/gateways',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'payment-gateways.html'));
});

router.get('/profile/:id/ico',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-ico-admin.html'));
});

router.get('/profile/:id/user',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-ico-user.html'));
});

router.get('/profile/:id/trade',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-trading-view.html'));
});


router.get('/profile/:id/buy',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'buy-and-sell.html'));
});

router.get('/profile/:id/affiliate',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , '/affailite-program.html'));
});

router.get('/profile/:id/wallet',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'my-wallet.html'));
});


router.get('/profile/:id/security',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'security.html'));
});

router.get('/profile/:id/account',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'account-confirmation.html'));
});

router.get('/profile/:id/settings',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'settings.html'));
});

router.get('/profile/:id/faq',  authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-faq.html'));
});

router.get('/profile/:id/support',   authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-support.html'));
});

router.get('/profile/:id/profile',   authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-profile.html'));
});


router.get('/profile/:id/btc',   authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'btc.html'));
});

router.get('/profile/:id/transactions',   authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'transactions.html'));
});

router.get('/profile/:id/users',   authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'users.html'));
});


module.exports = router;