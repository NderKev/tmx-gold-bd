
const fetch  = require('node-fetch');
const express  = require('express');
const router  = express.Router();
const config = require('../config');
const listen = require('../controllers/listen')
const {authenticator} = require('../lib/common');

const BTC_ADDRESS = config.BTC_ADDRESS; // replace with your merchant BTC address

// Endpoint to get QR and payment info
router.get("/payment-info/:amount", authenticator, async (req, res) => {
 const prices = await listen.getPrices();
 const btc_price = prices ? prices.BTC : 0;
 const EXPECTED_AMOUNT = parseFloat(req.params.amount);
  const qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:${BTC_ADDRESS}?amount=${EXPECTED_AMOUNT}`;
  
  res.json({
    address: BTC_ADDRESS,
    amount: EXPECTED_AMOUNT,
    qr: qrUrl
  });
});

// Endpoint to check payment status
router.get("/check-payment/:amount", authenticator, async (req, res) => {
  try {
    const EXPECTED_AMOUNT = parseFloat(req.params.amount);
    const resp = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${BTC_ADDRESS}/balance`);
    const data = await resp.json();

    // Convert satoshis → BTC
    const receivedBTC = data.total_received / 1e8;

    let status = "pending";
    if (receivedBTC >= EXPECTED_AMOUNT) {
      status = "paid";
    }

    res.json({ status, receivedBTC });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check payment" });
  }
});


module.exports = router;