const express  = require('express');
const router  = express.Router();
const transactionsController = require('../controllers/transactions');
const {authenticator} = require('../lib/common');


router.post('/transaction', authenticator, async (req, res) => {
  const response = await transactionsController.createTransaction(req.body)
  return res.status(response.status).send(response)
})

router.put('/update/:id', authenticator, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await transactionsController.updateTransactionByID(req.body);
  return res.status(response.status).send(response)
})


router.get('/fetchAll', authenticator, async (req, res) => {
  const response = await transactionsController.fetchAllTransactions()
  return res.status(response.status).send(response)
})


router.get('/fetch/:email', authenticator, async (req, res) => {
  //req.body.user_id = req.params.email;
  const response = await transactionsController.getTransactionByUserEmail(req.params.email)
  return res.status(response.status).send(response)
})

router.get('/fiat/:email', authenticator, async (req, res) => {
  //req.body.user_id = req.params.email;
  const response = await transactionsController.getFiatTransactionByUserEmail(req.params.email)
  return res.status(response.status).send(response)
})

router.get('/token/:email', authenticator, async (req, res) => {
  //req.body.user_id = req.params.email;
  const response = await transactionsController.getTokenTransactionByUserEmail(req.params.email)
  return res.status(response.status).send(response)
})

router.put('/update/:ref', authenticator, async (req, res) => {
  req.body.ref = req.params.ref;
  const response = await transactionsController.updateTransactionByRef(req.body);
  return res.status(response.status).send(response)
})

router.put('/update/:id', authenticator, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await transactionsController.updateTransactionByID(req.body);
  return res.status(response.status).send(response)
})

module.exports = router;