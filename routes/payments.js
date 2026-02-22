// routes/payments.js
const express = require("express");
const axios = require("axios");
const fetch = require("node-fetch");
const listen = require("../controllers/listen");
const tokens = require("../controllers/tokens");
const transactions = require("../controllers/transactions");
const FROM_ADDRESS = "0x9C70dB844aFF616CC01ca3914a80dCA555Eb8d9A";
const {authenticator} = require('../lib/common');
const { FiatTransactionMail} = require('../mails');
const sendEmail = require('../helpers/sendMail');
const userModel = require("../models/users");
const router = express.Router();

// you can create a .env file on the server for the public and private keys
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;


router.post("/paystack", async (req, res) => {
  try {
    const { reference, address, email, amount, token, usd} = req.body;
   // let  =
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
      try {
      let user_name = await userModel.fetchUserName(reqData.email);
      user_name = user_name[0].name;
      await sendEmail(email, FiatTransactionMail(user_name, reference, "paystack", "usd", amount, usd));
      
    } catch (error) {
      console.log(error);
    } 
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
router.post("/verify-mpesa",async (req, res) => {
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
        fiat: "kes",
        to: "TMX Global Mpesa",    
        status: "complete",
        amount: amount,
        usd: usd
      }
      await transactions.createFiatTransaction(reqData);
      // transfer of TMX coins to the user should be added here
      try {
      let user_name = await userModel.fetchUserName(reqData.email);
      user_name = user_name[0].name;
      await sendEmail(email, FiatTransactionMail(user_name, reference, "mpesa", "kes", amount, usd));
      
    } catch (error) {
      console.log(error);
    } 
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

router.post('/btc',  async (req, res) => {
  const {email, from, address, token} = req.body;
  const response = await listen.listenBTC({email : email, from : from});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});

router.post('/eth',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response =  await listen.listenEth({email : email, from : from, amount : amount});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});


router.post('/avax',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response = await listen.listenAvax({email : email, from : from, amount : amount});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  
  return res.status(response.status).send(response);
});


router.post('/bnb',async (req, res) => {
   const {email, from, amount, address, token} = req.body;
  const response = await listen.listenBnb({email : email, from : from, amount : amount});
   await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});

router.post('/usdc',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response =   await listen.listenUSDC({email : email, from : from, amount : amount});
   await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});

router.post('/usdt',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response = await listen.listenUSDT({email : email, from : from, amount : amount});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});

router.post('/avax-usdc',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response = await listen.listenAvaxUSDC({email : email, from : from, amount : amount});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  return res.status(response.status).send(response);
});

router.post('/avax-usdt',async (req, res) => {
   const {email, from, amount, address, token} = req.body;

  const response = await listen.listenAvaxUSDT({email : email, from : from, amount : amount});
  await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  
  return res.status(response.status).send(response);
});


router.post('/send-tokens',async (req, res) => {
   const {email, token, address} = req.body
  const response = await tokens.SendTokens({to : address, amount : token, email : email, from : FROM_ADDRESS});
  
  return res.status(response.status).send(response);
});

router.post('/tx',async (req, res) => {
  const response = await transactions.createTransaction(req.body);
  return res.status(response.status).send(response);
});




router.post('/latest/paystack', async (req, res) => {
    const { reference, address, usd, token } = req.body;

    try {
        // 1. Verify the transaction with Paystack directly
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` // Use SECRET key here
            }
        });

        const data = response.data.data;

        // 2. Validate the data integrity
        // Check if Paystack says 'success' AND the amount matches your record
        const expectedAmountInCents = Math.round(usd * 100); 
        
        if (data.status === 'success' && data.amount === expectedAmountInCents) {
            
            // 3. Trigger Token Dispatch
            // Call your Smart Contract 'transfer' function here using ethers.js or web3.js
            const tx = await sendTokensToWallet(address, token);

            return res.status(200).json({ 
                status: "success", 
                message: "Payment verified and tokens dispatched",
                txHash: tx.hash 
            });
        } else {
            return res.status(400).json({ status: "error", message: "Invalid transaction data" });
        }

    } catch (error) {
        console.error("Paystack Verification Error:", error.response?.data || error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

module.exports = router;
