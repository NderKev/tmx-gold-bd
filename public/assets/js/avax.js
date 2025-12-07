/* ============================================================
   BASE MAINNET – PAYMENT + TOKEN SENDER SCRIPT
   Avalanche removed, Base added
============================================================ */

const ERC20_ABI = [
  "function transfer(address to, uint amount) returns (bool)"
];

const TOKEN_ADDRESSES = {
  USDT: {
    ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    base: "0xA561d82eb8b8eE4e4f8dD61B54D4bBeC3f10c5c1"
  },
  USDC: {
    ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    base: "0x833589fCD6EDb6E08f4c7C35d1A2c3e6e6fC72aE"
  }
};

const ETH_ADDRESS = "0x39bbe9679406bbeca2ea6ac680cfcc24dec900a8";

/* -----------------------------
       Supported Chains
------------------------------ */
const CHAINS = {
  ethereum: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/eth"],
    blockExplorerUrls: ["https://etherscan.io/"]
  },

  base: {
    chainId: "0x2105",
    chainName: "Base Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org/"]
  },

  bsc: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"]
  }
};

/* -----------------------------
       Network Switching
------------------------------ */
async function switchChain(chain) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAINS[chain].chainId }]
    });
  } catch (err) {
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [CHAINS[chain]]
      });
    } else {
      throw err;
    }
  }
}

/* -----------------------------
         Price Fetching
------------------------------ */
async function getPrices() {
  const ids = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "tether",
    "usd-coin",
    "celo-kenyan-shilling"
  ];

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      BNB: data.binancecoin.usd,
      USDT: data.tether.usd,
      USDC: data["usd-coin"].usd,
      Mpesa: data["celo-kenyan-shilling"].usd,
      Paystack: data["celo-kenyan-shilling"].kes
    };
  } catch (err) {
    console.error("Price fetch error:", err);
    return null;
  }
}

/* CKES price (KES + USD) */
const CKES_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=celo-kenyan-shilling&vs_currencies=usd,kes";

async function getCKESPrice() {
  try {
    const response = await fetch(CKES_URL);
    const data = await response.json();
    return {
      usd: data["celo-kenyan-shilling"].usd,
      kes: data["celo-kenyan-shilling"].kes
    };
  } catch (e) {
    console.error("CKES price error:", e);
  }
}

const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";

/* Preload Prices */
let prices, kes_prices;
(async () => {
  prices = await getPrices();
  kes_prices = await getCKESPrice();
})();

/* -----------------------------
       Unified Token Sender
------------------------------ */
async function sendToken({ token, chain, recipient, amount }) {
  if (!window.ethereum) return alert("MetaMask not found!");

  await switchChain(chain);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const min_eth = (10 / prices.ETH).toFixed(4);
  const min_btc = (10 / prices.BTC).toFixed(8);
  const min_bnb = (10 / prices.BNB).toFixed(4);

  const minAmount = {
    ETH: min_eth,
    BNB: min_bnb,
    ERC20: ethers.parseUnits("10", 6)
  };

  let parsedAmount;

  /* Native tokens */
  if (["ETH", "BNB"].includes(token)) {
    parsedAmount = ethers.parseEther(amount.toString());
    if (parsedAmount < minAmount[token]) {
      return alert(`Min ${token} is ${ethers.formatEther(minAmount[token])}`);
    }

    const tx = await signer.sendTransaction({
      to: recipient,
      value: parsedAmount
    });

    alert(`${token} TX sent: ${tx.hash}`);
    await tx.wait();
    alert(`${token} confirmed!`);
  }

  /* ERC20 on ETH or BASE */
  else {
    const tokenAddress = TOKEN_ADDRESSES[token][chain];
    if (!tokenAddress)
      throw new Error(`${token} not supported on ${chain}`);

    parsedAmount = ethers.parseUnits(amount.toString(), 6);

    if (parsedAmount < minAmount.ERC20) {
      return alert(
        `Amount too low. Min for ${token} is ${ethers.formatUnits(
          minAmount.ERC20,
          6
        )}`
      );
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await contract.transfer(recipient, parsedAmount);

    alert(`${token} TX sent: ${tx.hash}`);
    await tx.wait();
    alert(`${token} confirmed!`);
  }
}

/* -----------------------------
  USD → Crypto Converter
------------------------------ */

const usdInput = document.getElementById("usd");
const tokenSelect = document.getElementById("payment_method");
const cryptoOutput = document.getElementById("amount");
const cryptoTo = document.getElementById("to_crypto");
const kes_amount = document.getElementById("paystackAmount");
const mpesa_amount = document.getElementById("mpesa_amount");
const wallet = document.getElementById("wallet_address");
const user_name = localStorage.getItem("tmx_gold_name");

async function convertUsdToCrypto() {
  prices = await getPrices();
  const usd = parseFloat(usdInput.value);
  const option = tokenSelect.value;

  if (isNaN(usd)) {
    cryptoOutput.value = "Invalid USD";
    return;
  }

  let result, result_kes;
  if (prices[option]) {
    result = usd / prices[option];
    result_kes = usd / prices[option];
  } else {
    result = usd / prices.BTC;
    result_kes = usd / prices.Paystack;
  }

  cryptoOutput.value = result.toString();

  if (option === "Mpesa") {
    cryptoTo.innerText = "KES";
    mpesa_amount.value = result_kes.toFixed(0);
  } else if (option === "Paystack") {
    cryptoTo.innerText = "USD";
    cryptoOutput.value = usd;
    kes_amount.value = usd;
  } else if (option === "BTC") {
    cryptoTo.innerText = "BTC";
    cryptoOutput.value = result.toFixed(6);
  } else {
    cryptoTo.innerText = option;
    cryptoOutput.value = result.toFixed(5);
  }
}

/* Live updates */
usdInput.onchange = convertUsdToCrypto;
tokenSelect.onchange = convertUsdToCrypto;
convertUsdToCrypto();

/* -----------------------------
         CONNECT METAMASK
------------------------------ */
async function connect() {
  if (!window.ethereum) return alert("Install MetaMask!");
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  wallet.value = signer.address;
}

document.addEventListener("DOMContentLoaded", () => {
  connect();
});

/* -----------------------------
   SEND BUTTON DISPATCHER
------------------------------ */
async function sendSelectedToken() {
  const amount = document.getElementById("amount").value;
  const option = document.getElementById("payment_method").value;

  if (option === "ETH")
    return sendToken({
      token: "ETH",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "USDC")
    return sendToken({
      token: "USDC",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "USDT")
    return sendToken({
      token: "USDT",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });

  /* BASE MAINNET USDT / USDC */
  if (option === "USDC_BASE")
    return sendToken({
      token: "USDC",
      chain: "base",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "USDT_BASE")
    return sendToken({
      token: "USDT",
      chain: "base",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "BNB")
    return sendToken({
      token: "BNB",
      chain: "bsc",
      recipient: ETH_ADDRESS,
      amount
    });

  /* Remaining (Mpesa, Paystack, BTC, Bank, Wire) unchanged */
}

document.getElementById("btnBuyTokens").onclick = sendSelectedToken;

/* -----------------------------
      CHECK PAYMENT STATUS
------------------------------ */
async function checkPayment(crypto, email, from, amount) {
  try {
    const res = await fetch(`${AUTH_BACKEND_URL}/api/payments/${crypto}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount, from })
    });

    const data = await res.json();
    if (data.data && data.status === 201) {
      document.getElementById("status").textContent = "✅ Payment Confirmed!";
      document.getElementById("status").className = "confirmed";
      clearInterval(polling);
    } else {
      document.getElementById("status").textContent =
        "⚡ Payment detected, waiting for confirmations...";
      document.getElementById("status").className = "pending";
    }
  } catch (err) {
    console.error("Payment check error:", err);
  }
}
