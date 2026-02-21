
const ethers = require( "ethers");
const fetch = require("node-fetch");
const transactionsModel = require('../models/transactions');
const WebSocket = require("ws");
const axios = require("axios");
const { TransactionMail} = require('../mails');
const sendEmail = require('../helpers/sendMail');
const userModel = require("../models/users");
const {successResponse, errorResponse} = require('../lib/response');
// ---------- CONFIG ----------
const config = require('../config');

const MONITOR_ADDRESS = config.ETH_ADDRESS?.toLowerCase(); // address to monitor

const logStruct = (func, error) => {
  return {'func': func, 'file': 'CryptoListenController', error}
}



async function getPrices() {
  const ids = [
    "bitcoin",    // BTC
    "ethereum",   // ETH
    "tether",     // USDT
    "usd-coin",   // USDC
    "avalanche-2",// AVAX
    "binancecoin" // BNB
  ];
  
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const prices = {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      USDT: data.tether.usd,
      USDC: data["usd-coin"].usd,
      AVAX: data["avalanche-2"].usd,
      BNB: data.binancecoin.usd,
      TMXG: 0.005
    };

    return prices;
  } catch (err) {
    console.error("Error fetching prices:", err);
    return null;
  }
}

/**  Example usage
//getPrices().then(console.log);
{
  BTC: 61500,
  ETH: 2900,
  USDT: 1,
  USDC: 1,
  AVAX: 34.5,
  BNB: 540
} **/

let prices;
 
const listenAvax = async (reqData) => {
  try {
    // choose network RPC (ETH Mainnet, Avalanche, or BNB Chain)
    //`https://avalanche-fuji.infura.io/v3/${config.INFURA_KEY}`
    const RPC_URL = "https://api.avax.network/ext/bc/C/rpc"; // Avalanche C-Chain RPC
    //wss://api.avax.network/ext/bc/C/ws
    // wss://avalanche-mainnet.infura.io/ws/v3/${config.INFURA_KEY}
    const provider = new ethers.WebSocketProvider("wss://api.avax.network/ext/bc/C/ws"); 
  // or use ethers.JsonRpcProvider if WS not supported by your RPC

    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    prices = await getPrices();
    
  // -------------------------------
  // 1. Native coin deposits (AVAX/ETH/BNB)
  // -------------------------------
    provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);
    for (const tx of block.transactions) {
      if (tx.to && tx.to.toLowerCase() === MONITOR_ADDRESS) {
        const value = ethers.formatEther(tx.value);
        const from = tx.from;
        const prices = await getPrices();
        let _avax_usd = parseFloat(value*(prices.AVAX));
        _avax_usd = _avax_usd.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: tx.hash,
            mode: "avax",
            type: "transfer",
            to: tx.to,    
            status: "complete",
            value: value, 
            usd: _avax_usd
         }
         await transactionsModel.createTransaction(data);
           try {
            let _amount = parseFloat(value*(prices.AVAX));
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            _amount = _amount.toFixed(2);
            let crypto = "AVAX"
            const link = `https://snowtrace.io/tx/${tx.hash}`
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, tx.to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 Native deposit received: ${value} AVAX at tx ${tx.hash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }

        
      }
    }
 });

  } catch (error) {
    console.error('error -> ', logStruct('listenAvax', error))
    return errorResponse(error.status, error.message);
  }
};



const listenBTC = async (reqData) => {
  try {
        const ADDRESS = config.BTC_ADDRESS;
        prices = await getPrices();
        const btc_price = prices.BTC;
        const MIN_AMOUNT = (10 / btc_price); // BTC threshold
        
        // Blockstream mempool API (ws)
        // Use `wss://mempool.space/api/v1/ws` for mainnet
        const ws = new WebSocket("wss://blockstream.info/api/v1/ws");

        ws.on("open", () => {
        console.log("🔍 Connected to Bitcoin mempool WebSocket");
        // subscribe to address transactions
        ws.send(JSON.stringify({ "track-address": ADDRESS }));
        });

        ws.on("message", async(msg) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.address === ADDRESS && data.tx) {
            let totalReceived = 0;
            for (const vout of data.tx.vout) {
                if (vout.scriptpubkey_address === ADDRESS) {
                totalReceived += vout.value; // value in sats
                    }
                }
                const btc = totalReceived / 1e8;
                let _btc_usd = parseFloat(btc*(prices.BTC));
                 _btc_usd = _btc_usd.toFixed(2);
                if (btc >= MIN_AMOUNT) {
                    console.log(`💰 BTC deposit received: ${btc} BTC in tx ${data.tx.txid}`);
                     let txData = {
                        email: reqData.email,
                        address: data.tx.from,
                        tx_hash: data.tx.txid,
                        mode: "btc",
                        type: "transfer",
                        to: ADDRESS,
                        status: "complete",
                        value: btc,
                        usd: _btc_usd
                    }
                    await transactionsModel.createTransaction(txData);
                   try {
                      let _amount = parseFloat(btc*(prices.BTC));
                      _amount = _amount.toFixed(2);
                      let user_name = await userModel.fetchUserName(reqData.email);
                       user_name = user_name[0].name;
                      let crypto = "Bitcoin"
                      const link = `https://live.blockcypher.com/tx/${data.tx.txid}`
                      await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, ADDRESS));
                    } catch (error) {
                      console.log(error);
                    }
                    console.log(`💰 Native deposit received: ${btc} BTC at tx ${data.tx.txid}`);
                    return successResponse(201, txData, 'transactionCreated')
            }
            }
        } catch (err) {
            console.error("Error parsing:", err);
            return errorResponse(403, err);
        }
        });

  } catch (error) {
    console.error('error -> ', logStruct('listenBTC', error))
    return errorResponse(error.status, error.message);
  }
};

const listenEth = async (reqData) => {
  try {
    // choose network RPC (ETH Mainnet, Avalanche, or BNB Chain)
    const RPC_URL = `https://mainnet.infura.io/v3/4a66158c06d1425dab6ef27cd2a6d8aa/${config.INFURA_KEY}`
    const provider = new ethers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${config.INFURA_KEY}`); 
  // or use ethers.JsonRpcProvider if WS not supported by your RPC
    prices = await getPrices();
    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);

  // -------------------------------
  // 1. Native coin deposits (AVAX/ETH/BNB)
  // -------------------------------
    provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);
    for (const tx of block.transactions) {
      if (tx.to && tx.to.toLowerCase() === MONITOR_ADDRESS) {
        const value = ethers.formatEther(tx.value);
        const from = tx.from;
        const prices = await getPrices();
        let _eth_usd = parseFloat(value*(prices.ETH));
        _eth_usd = _eth_usd.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: tx.hash,
            mode: "eth",
            type: "transfer",
            to: tx.to,    
            status: "complete",
            value: value,
            usd: _eth_usd
         }
         await transactionsModel.createTransaction(data);
         try {
            let _amount = parseFloat(value*(prices.ETH));
            _amount = _amount.toFixed(2);
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            let crypto = "Ether"
            const link = `https://etherscan.io/tx/${tx.hash}`
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, tx.to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 Native deposit received: ${value} ETH at tx ${tx.hash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    }
 });

  } catch (error) {
    console.error('error -> ', logStruct('listenEth', error))
    return errorResponse(error.status, error.message);
  }
};



const listenBnb = async (reqData) => {
  try {
    // choose network RPC (ETH Mainnet, Avalanche, or BNB Chain)
    const RPC_URL = "https://bsc-dataseed.binance.org/"
    const provider = new ethers.JsonRpcProvider(RPC_URL); 
  // or use ethers.JsonRpcProvider if WS not supported by your RPC

    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    prices = await getPrices();
  // -------------------------------
  // 1. Native coin deposits (AVAX/ETH/BNB)
  // -------------------------------
    provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);
    for (const tx of block.transactions) {
      if (tx.to && tx.to.toLowerCase() === MONITOR_ADDRESS) {
        const value = ethers.formatEther(tx.value);
        const from = tx.from;
        const prices = await getPrices();
         let _bnb_usd = parseFloat(value*(prices.BNB));
         _bnb_usd = _bnb_usd.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: tx.hash,
            mode: "bnb",
            type: "transfer",
            to: tx.to,    
            status: "complete",
            value: value,
            usd: _bnb_usd
         }
         await transactionsModel.createTransaction(data);
          try {
            let _amount = parseFloat(value*(prices.BNB));
            _amount = _amount.toFixed(2);
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            let crypto = "BNB"
            const link = `https://bscscan.com/tx/${tx.hash}`
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, tx.to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 Native deposit received: ${value} BNB at tx ${tx.hash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    }
 });

  } catch (error) {
    console.error('error -> ', logStruct('listenBNB', error))
    return errorResponse(error.status, error.message);
  }
};



const listenAvaxUSDC = async (reqData) => {
  try {
    
    const RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
    const provider = new ethers.WebSocketProvider("wss://api.avax.network/ext/bc/C/ws");
    prices = await getPrices();
    const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];
    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    const address = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
    const token = new ethers.Contract(address, ERC20_ABI, provider);
    const decimals = await token.decimals();

    token.on("Transfer", async(from, to, value, event) => {
      if (to.toLowerCase() === MONITOR_ADDRESS) {
        const amount = ethers.formatUnits(value, decimals);
        //const from = from;
        const prices = await getPrices();
        let _avax_usd = parseFloat(value*(prices.USDC));
         _avax_usd = _avax_usd.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: event.log.transactionHash,
            mode: "avax",
            type: "transfer",
            to: to,    
            status: "complete",
            value: amount,
            usd: _avax_usd
         }
         await transactionsModel.createTransaction(data);
            try {
            let _amount = parseFloat(value*(prices.USDC));
            _amount = _amount.toFixed(2);
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            let crypto = "Avax Usd Coin"
            const link = `https://snowtrace.io/tx/${event.log.transactionHash}`
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 Avax USDC deposit received: ${amount} from ${from} at tx ${event.log.transactionHash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    });

    console.log(`📡 Listening for AVAX USDC deposits...`);

  } catch (error) {
    console.error('error -> ', logStruct('listenAvaxUSDC', error))
    return errorResponse(error.status, error.message);
  }
};


const listenAvaxUSDT = async (reqData) => {
   try{
    const RPC_URL = "https://api.avax.network/ext/bc/C/rpc"
    const provider = new ethers.WebSocketProvider("wss://api.avax.network/ext/bc/C/ws"); 
    prices = await getPrices();
    const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];
    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    const address = "0x9702230A8Ea53601f5cd2dc00fDBc13d4dF4A8c7";
    const token = new ethers.Contract(address, ERC20_ABI, provider);
    const decimals = await token.decimals();

    token.on("Transfer", async(from, to, value, event) => {
      if (to.toLowerCase() === MONITOR_ADDRESS) {
        const amount = ethers.formatUnits(value, decimals);
        //const from = from;
        const prices = await getPrices();
        let _amount = parseFloat(value*(prices.USDT));
         _amount = _amount.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: event.log.transactionHash,
            mode: "avax",
            type: "transfer",
            to: to,    
            status: "complete",
            value: amount,
            usd: _amount
         }
         await transactionsModel.createTransaction(data);
          try {         
            let crypto = "Avax Tether Coin"
            const link = `https://snowtrace.io/tx/${event.log.transactionHash}`
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 Avax USDT deposit received: ${amount} from ${from} at tx ${event.log.transactionHash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    });

    console.log(`📡 Listening for AVAX USDT deposits...`);

  } catch (error) {
    console.error('error -> ', logStruct('listenAvaxUSDT', error))
    return errorResponse(error.status, error.message);
  }
};


const listenUSDC = async (reqData) => {
  try {
    
    const RPC_URL = `https://mainnet.infura.io/v3/4a66158c06d1425dab6ef27cd2a6d8aa/${config.INFURA_KEY}`
    const provider = new ethers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${config.INFURA_KEY}`); 
    prices = await getPrices();
    const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];
    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    const address = "0xA0b86991c6218b36c1d19d4a2e9Eb0cE3606eB48";
    const token = new ethers.Contract(address, ERC20_ABI, provider);
    const decimals = await token.decimals();

    token.on("Transfer", async(from, to, value, event) => {
      if (to.toLowerCase() === MONITOR_ADDRESS) {
        const amount = ethers.formatUnits(value, decimals);
        //const from = from;
        const prices = await getPrices();
        let _amount = parseFloat(value*(prices.USDT));
        _amount = _amount.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: event.log.transactionHash,
            mode: "usdc",
            type: "transfer",
            to: to,    
            status: "complete",
            value: amount,
            usd: _amount
         }
         await transactionsModel.createTransaction(data);
         try {         
            let crypto = "USD Coin"
            const link = `https://etherscan.io/tx/${event.log.transactionHash}`
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 USDC deposit received: ${amount} from ${from} at tx ${event.log.transactionHash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    });

    console.log(`📡 Listening for USDC deposits...`);

  } catch (error) {
    console.error('error -> ', logStruct('listenUSDC', error))
    return errorResponse(error.status, error.message);
  }
};

const listenUSDT = async (reqData) => {
  try {
    
    const RPC_URL = `https://mainnet.infura.io/v3/4a66158c06d1425dab6ef27cd2a6d8aa/${config.INFURA_KEY}`
    const provider = new ethers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${config.INFURA_KEY}`); 
    prices = await getPrices();
    const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];
    console.log("🔍 Listening for payments to:", MONITOR_ADDRESS);
    const address = "0xdAC17F958D2ee523a2206206994597C13d831ec7";
    const token = new ethers.Contract(address, ERC20_ABI, provider);
    const decimals = await token.decimals();

    token.on("Transfer", async(from, to, value, event) => {
      if (to.toLowerCase() === MONITOR_ADDRESS) {
        const amount = ethers.formatUnits(value, decimals);
        //const from = from;
        const prices = await getPrices();
          let _amount = parseFloat(value*(prices.USDT));
         _amount = _amount.toFixed(2);
        if(value == reqData.amount && reqData.from === from){
         let data = {
            email: reqData.email,
            address: reqData.from,
            tx_hash: event.log.transactionHash,
            mode: "usdt",
            type: "transfer",
            to: to,    
            status: "complete",
            value: amount,
            usd: _amount
         }
         await transactionsModel.createTransaction(data);
         try {         
            let crypto = "Tether Coin"
            const link = `https://etherscan.io/tx/${event.log.transactionHash}`
            let user_name = await userModel.fetchUserName(reqData.email);
            user_name = user_name[0].name;
            await sendEmail(reqData.email, TransactionMail(user_name, link, _amount, crypto, to));
          } catch (error) {
            console.log(error);
          } 
         console.log(`💰 USDC deposit received: ${amount} from ${from} at tx ${event.log.transactionHash}`);
         return successResponse(201, data, 'transactionCreated')
        }
        else {
            return errorResponse(403, 'invalidTransaction');
        }
        
      }
    });

    console.log(`📡 Listening for USDT deposits...`);

  } catch (error) {
    console.error('error -> ', logStruct('listenUSDT', error))
    return errorResponse(error.status, error.message);
  }
};

module.exports = { 
    getPrices,
    listenAvax,
    listenBTC,
    listenEth,
    listenBnb,
    listenAvaxUSDC,
    listenAvaxUSDT,
    listenUSDC,
    listenUSDT
}