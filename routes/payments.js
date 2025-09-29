// routes/payments.js
const express = require("express");
const axios = require("axios");
const listen = require("../controllers/listen");
const tokens = require("../controllers/tokens");
const transactions = require("../controllers/transactions");
const FROM_ADDRESS = "0x9C70dB844aFF616CC01ca3914a80dCA555Eb8d9A";
const {authenticator} = require('../lib/common');
const router = express.Router();

// you can create a .env file on the server for the public and private keys
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;


router.post("/paystack", authenticator, async (req, res) => {
  try {
    const { reference, address, email, amount, token, usd} = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "No reference supplied",
      });
    }

    /**
     *   email: data.email,
    ref_no: data.ref_no,
    mode: data.mode,
    fiat: data.fiat,
    to: data.to,    
    status: data.status,
    amount: data.amount,
    usd: data.usd,
     */

    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    const data = response.data;

    if (data.status && data.data.status === "success") {
      let reqData = {
        email: email,
        ref_no: reference,
        mode: "paystack",
        fiat: "usd",
        to: "TMX Global PayStack",    
        status: "complete",
        amount: amount,
        usd: usd
      }
      await transactions.createFiatTransaction(reqData);
      // transfer of TMX coins to the user should be added here

       await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
       
      return res.json({
        success: true,
        message: "Payment verified successfully",
        data: data.data,
      });
    } else {
      return res.json({
        success: false,
        message: "Payment verification failed",
        data,
      });
    }
  } catch (err) {
    console.error("Paystack Verification Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
});

// ✅ Verify payment endpoint
router.post("/verify-mpesa", authenticator, async (req, res) => {
  //const reference = req.query.reference;
  const { reference, address, email, amount, token, usd} = req.body;
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
    });
    const result = await response.json();

    if (result.status && result.data.status === "success") {
      console.log("✅ Payment Success:", result.data);
      let reqData = {
        email: email,
        ref_no: reference,
        mode: "mpesa",
        fiat: "usd",
        to: "TMX Global Mpesa",    
        status: "complete",
        amount: amount,
        usd: usd
      }
      await transactions.createFiatTransaction(reqData);
      // transfer of TMX coins to the user should be added here

       await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
      return res.json({ status: "success", data: result.data });
    } else {
      return res.json({ status: "failed", data: result.data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

router.post('/btc', authenticator, async (req, res) => {
  const {email, from} = req.body;
  const response = await listen.listenBTC({email : email, from : from});;
  
  return res.status(response.status).send(response);
});

router.post('/eth', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response =  await listen.listenEth({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});


router.post('/avax', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response = await listen.listenAvax({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});


router.post('/bnb', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;
  const response = await listen.listenBnb({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});

router.post('/usdc', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response =   await listen.listenUSDC({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});

router.post('/usdt', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response = await listen.listenUSDT({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});

router.post('/avax-usdc', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response = await listen.listenAvaxUSDC({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});

router.post('/avax-usdt', authenticator, async (req, res) => {
   const {email, from, amount} = req.body;

  const response = await listen.listenAvaxUSDT({email : email, from : from, amount : amount});
  
  return res.status(response.status).send(response);
});


router.post('/send-tokens', authenticator, async (req, res) => {
   const {email, token, address} = req.body
  const response = await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  
  return res.status(response.status).send(response);
});

router.post('/tx', authenticator, async (req, res) => {
  const response = await transactions.createTransaction(req.body);
  return res.status(response.status).send(response);
});


module.exports = router;
