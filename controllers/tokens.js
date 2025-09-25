const ethers = require("ethers");

// -------- CONFIG --------
const dotenv = require('dotenv');
//dotenv.config({ path: '../../.env'});
dotenv.config({ path: './.env'});
const listen = require('./listen')
const {successResponse, errorResponse} = require('../lib/response');
const RPC_URL = "https://api.avax.network/ext/bc/C/rpc"; // Avalanche mainnet
const PRIVATE_KEY = process.env.PRIVATE_KEY;   // reserve wallet PK
const TOKEN_ADDRESS = process.env.TMX_GOLD_ADDRESS; // ERC20 contract on Avalanche
const transactionsModel = require('../models/transactions');

const logStruct = (func, error) => {
  return {'func': func, 'file': 'TokensController', error}
}

const SendTokens = async (reqData) => {
  try {
        const TO_ADDRESS = reqData.to;    // recipient
        const AMOUNT = reqData.amount;           // number of tokens to send (human-readable)
        // ------------------------

        const ERC20_ABI = [
        "function decimals() view returns (uint8)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 value) returns (bool)"
        ];
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // Reserve wallet signer
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        // ERC20 contract instance
        const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

        // Get decimals to format amount
        const decimals = await token.decimals();
        const amountInUnits = ethers.parseUnits(AMOUNT, decimals);

        // Check balance
        const balance = await token.balanceOf(wallet.address);
        if (balance < amountInUnits) {
            throw new Error("Not enough token balance in reserve address");
        }

        console.log(`Sending ${AMOUNT} tokens from ${wallet.address} to ${TO_ADDRESS}...`);

        // Send transaction
        const tx = await token.transfer(TO_ADDRESS, amountInUnits);
        console.log("Tx submitted:", tx.hash);
        const prices = await listen.getPrices();
        let _amount = parseFloat(AMOUNT*(prices.TMXG));
        // Wait for confirmation
        let response = await tx.wait();
        let data = {
                    email: reqData.email,
                    address: reqData.from,
                    tx_hash: tx.hash,
                    mode: "avax",
                    type: "debit",
                    to: TO_ADDRESS,    
                    status: "pending",
                    value: value,
                    usd: _amount.toFixed(2)
                 }
        await transactionsModel.createTransaction(data);
        let dat = {
                    email: reqData.email,
                    address: reqData.from,
                    tx_hash: tx.hash,
                    type: "buy",
                    to: TO_ADDRESS,    
                    status: "pending",
                    value: value,
                    usd: _amount.toFixed(2)
                 }
        await transactionsModel.createTokenTransaction(dat);
        console.log("✅ Transfer confirmed");
         return successResponse(201, response, 'transactionCreated')

  } catch (error) {
    console.error('error -> ', logStruct('SendTokens', error))
    return errorResponse(error.status, error.message);
  }
};




module.exports = {
    SendTokens
}