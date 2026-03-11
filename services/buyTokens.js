const SALE_ABI = [
  "function buyTokens(uint256 tokenAmount) external payable",
  "function salePriceWei() view returns (uint256)"
];

const ethers = require( "ethers");

const dotenv = require("dotenv");

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const TMXGoldTokenSaleContract = "0xa08b8213e691ff086eF6E15B6C499397A49E9c63";
const contract = new ethers.Contract(
  TMXGoldTokenSaleContract,
  SALE_ABI,
  wallet
);


export async function processPurchase(tokenAmount, expectedEthWei) {
  try {
    if (!tokenAmount || tokenAmount <= 0)
      throw new Error("Invalid token amount");

    const salePriceWei = await contract.salePriceWei();
    const amount = BigInt(tokenAmount);//ethers.parseUnits(tokenAmount.toString(), 18);
    const requiredCost = amount * salePriceWei;

    if (requiredCost !== BigInt(expectedEthWei)) {
      throw new Error("ETH amount mismatch");
    }

    // Estimate gas first
    const gasEstimate = await contract.buyTokens.estimateGas(amount, {
      value: requiredCost
    });

    const tx = await contract.buyTokens(amount, {
      value: requiredCost,
      gasLimit: gasEstimate
    });

    console.log("TX Sent:", tx.hash);

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error("Purchase error:", error);
    return { success: false, error: error.message };
  }
}

export async function buyTokensBackend(tokenAmount) {
  try {
    if (!tokenAmount || tokenAmount <= 0) {
      throw new Error("Token amount must be greater than 0");
    }

    // Get price from contract
    const salePriceWei = await contract.salePriceWei();

    // Convert to BigInt
    const amount = BigInt(tokenAmount);
    //const amount = ethers.parseUnits(tokenAmount.toString(), 18);

    // Calculate ETH cost
    const cost = amount * salePriceWei;

    console.log("Buying:", amount.toString(), "tokens");
    console.log("Cost (wei):", cost.toString());

    // Send transaction
    const tx = await contract.buyTokens(amount, {
      value: cost
    });

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();

    console.log("Confirmed in block:", receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error("Buy failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
}


export function startEventListener() {
  contract.on("TokensPurchased", (buyer, amount, cost, event) => {
    console.log("Purchase confirmed:");
    console.log("Buyer:", buyer);
    console.log("Amount:", amount.toString());
    console.log("Cost:", cost.toString());
    console.log("TxHash:", event.log.transactionHash);

    // TODO:
    // Save to database
    // Mark order as completed
    // Send email notification
  });
}


startEventListener();
