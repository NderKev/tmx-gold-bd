const { ethers, NonceManager } = require("ethers");
const axios = require("axios");
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();

// ===== CONFIG =====
const RPC_URL = "https://mainnet.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = "0x2AE74FEc832A702eB472d93a889eFcF8c40dD18A";

// Replace with your ABI
const ABI = [
  "function updateSalePrice(uint256 _price) external",
  "function salePriceWei() view returns (uint256)",
];

// ===== SETUP =====
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Nonce-safe signer
const managedSigner = new NonceManager(wallet);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
const managedContract = contract.connect(managedSigner);

// ===== UTIL: GET ETH PRICE =====
async function getEthPrice() {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "ethereum",
        vs_currencies: "usd",
      },
    }
  );

  return res.data.ethereum.usd;
}

// ===== CRON: UPDATE PRICE =====
let isRunning = false;

async function updatePrice() {
  try {
    const ethPrice = await getEthPrice();

    const tokenPriceUSD = 0.005;
    const tokenPriceWei = BigInt(
      Math.floor((tokenPriceUSD / ethPrice) * 1e18)
    );

    const currentPrice = await managedContract.salePriceWei();

    if (currentPrice === tokenPriceWei) {
      console.log("No price change. Skipping update.");
      return;
    }

    console.log("Updating price...");
    console.log("ETH:", ethPrice);
    console.log("New price (wei):", tokenPriceWei.toString());

    const tx = await managedContract.updateSalePrice(tokenPriceWei);
    console.log("TX sent:", tx.hash);

    await tx.wait();

    console.log("✅ Price updated");
  } catch (err) {
    console.error("❌ Price update failed:", err.message);
  }
}

// Run once per day at midnight (Kenya time)
cron.schedule(
  "0 0,12 * * *",
  async () => {
    if (isRunning) {
      console.log("Skipping: already running");
      return;
    }

    isRunning = true;

    try {
      await updatePrice();
    } finally {
      isRunning = false;
    }
  },
  {
    timezone: "Africa/Nairobi",
  }
);

// ===== BUY TOKENS (SAFE) =====
/** export async function buyTokensBackend(tokenAmount) {
  try {
    if (!tokenAmount || tokenAmount <= 0) {
      throw new Error("Token amount must be greater than 0");
    }

    const salePriceWei = await managedContract.salePriceWei();

    const amount = BigInt(tokenAmount);
    const cost = amount * salePriceWei;

    console.log("Buying tokens...");
    console.log("Amount:", amount.toString());
    console.log("Price:", salePriceWei.toString());
    console.log("Cost:", cost.toString());

    const gasEstimate =
      await managedContract.buyTokens.estimateGas(amount, {
        value: cost,
      });

    const tx = await managedContract.buyTokens(amount, {
      value: cost,
      gasLimit: gasEstimate,
    });

    console.log("TX sent:", tx.hash);

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || String(error),
    };
  }
} **/