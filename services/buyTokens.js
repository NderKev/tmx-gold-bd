const SALE_ABI = [
  "function buyTokens(uint256 tokenAmount) external payable",
  "function salePriceWei() view returns (uint256)",
];

const ethers = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const TMXGoldTokenSaleContract = "0xa08b8213e691ff086eF6E15B6C499397A49E9c63";

const contract = new ethers.Contract(TMXGoldTokenSaleContract, SALE_ABI, wallet);

async function processPurchase(tokenAmount, expectedEthWei) {
  try {
    if (!tokenAmount || tokenAmount <= 0) throw new Error("Invalid token amount");

    const salePriceWei = await contract.salePriceWei();
    const amount = BigInt(tokenAmount);
    const requiredCost = amount * salePriceWei;

    if (requiredCost !== BigInt(expectedEthWei)) {
      throw new Error("ETH amount mismatch");
    }

    const gasEstimate = await contract.buyTokens.estimateGas(amount, {
      value: requiredCost,
    });

    const tx = await contract.buyTokens(amount, {
      value: requiredCost,
      gasLimit: gasEstimate,
    });

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    return { success: false, error: error?.message || String(error) };
  }
}

async function buyTokensBackend(tokenAmount) {
  try {
    if (!tokenAmount || tokenAmount <= 0) {
      throw new Error("Token amount must be greater than 0");
    }

    const salePriceWei = await contract.salePriceWei();
    const amount = BigInt(tokenAmount);
    const cost = amount * salePriceWei;

    const gasEstimate = await contract.buyTokens.estimateGas(amount, {
      value: cost,
    });

    const tx = await contract.buyTokens(amount, {
      value: cost,
      gasLimit: gasEstimate,
    });

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
}

function startEventListener() {
  try {
    contract.on("TokensPurchased", (buyer, amount, cost, event) => {
      console.log("Purchase confirmed:");
      console.log("Buyer:", buyer);
      console.log("Amount:", amount.toString());
      console.log("Cost:", cost.toString());
      console.log("TxHash:", event.log.transactionHash);
    });
  } catch (error) {
    console.error("Failed to start token sale event listener:", error);
  }
}

if (process.env.ENABLE_TOKEN_SALE_LISTENER === "true") {
  startEventListener();
}

module.exports = {
  processPurchase,
  buyTokensBackend,
  startEventListener,
};
