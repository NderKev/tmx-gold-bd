// routes/payments.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// you can create a .env file on the server for the public and private keys
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

router.post("/", async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "No reference supplied",
      });
    }

    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    const data = response.data;

    if (data.status && data.data.status === "success") {
      // transfer of TMX coins to the user should be added here
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

module.exports = router;
