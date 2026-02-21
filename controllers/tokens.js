const ethers = require("ethers");
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const listen = require('./listen')
const {successResponse, errorResponse} = require('../lib/response');
const sendEmail = require('../helpers/sendMail');

// -------- UPDATED CONFIG FOR BASE --------
const RPC_URL = "https://mainnet.base.org"; // Base Mainnet RPC
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const TOKEN_ADDRESS = process.env.TMX_GOLD_ADDRESS; // Your TMXG contract address on Base
// -----------------------------------------

const transactionsModel = require('../models/transactions');
const { DepositMail } = require('../mails');
const userModel = require("../models/users");

const logStruct = (func, error) => {
  return {'func': func, 'file': 'TokensController', error}
}

const SendTokens = async (reqData) => {
  try {
        const TO_ADDRESS = reqData.to;    
        const AMOUNT = reqData.amount;           

        const ERC20_ABI = [
            "function decimals() view returns (uint8)",
            "function balanceOf(address) view returns (uint256)",
            "function transfer(address to, uint256 value) returns (bool)"
        ];
        
        // Connect to Base
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

        const decimals = await token.decimals();
        const amountInUnits = ethers.parseUnits(AMOUNT, decimals);

        const balance = await token.balanceOf(wallet.address);
        if (balance < amountInUnits) {
            throw new Error("Not enough token balance in reserve address");
        }

        console.log(`Sending ${AMOUNT} tokens on Base from ${wallet.address} to ${TO_ADDRESS}...`);

        // Send transaction on Base
        const tx = await token.transfer(TO_ADDRESS, amountInUnits);
        console.log("Tx submitted:", tx.hash);

        const prices = await listen.getPrices();
        let _amount = parseFloat(AMOUNT * (prices.TMXG));
        
        await tx.wait();

        let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: tx.hash,
            mode: "base", // Changed from 'avax' to 'base'
            type: "debit",
            to: TO_ADDRESS,    
            status: "success", // Usually set to success after tx.wait()
            usd: _amount.toFixed(2)
        }
        await transactionsModel.createTransaction(data);

        try {         
            // Updated link to Basescan
            const link = `https://basescan.org/tx/${tx.hash}`
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            await sendEmail(reqData.email, DepositMail(user_name, link, _amount, TO_ADDRESS));
        } catch (error) {
            console.log("Email Error:", error);
        } 

        console.log("✅ Transfer confirmed on Base");
        return successResponse(201, { hash: tx.hash }, 'transactionCreated')

  } catch (error) {
    console.error('error -> ', logStruct('SendTokens', error))
    return errorResponse(error.status || 500, error.message);
  }
};

module.exports = { SendTokens }