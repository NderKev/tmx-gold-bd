/* ============================================================
   BASE MAINNET – PAYMENT + TOKEN SENDER SCRIPT
   Avalanche removed, Base added
============================================================ */

//const { useDebugValue } = require("react");

const ERC20_ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function decimals() view returns (uint8)"
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


function sanitizeAmount(value, decimals = 18) {
  if (!value) return "0";
  const [whole, frac = ""] = value.toString().split(".");
  return frac.length > decimals
    ? `${whole}.${frac.slice(0, decimals)}`
    : value.toString();
}

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
    // Base native token is commonly shown as ETH (same unit), but we support "BASE" symbol in UI.
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
  if (!window.ethereum) throw new Error("No injected wallet found");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAINS[chain].chainId }]
    });
  } catch (err) {
    // 4902 means chain not added to wallet — attempt to add it
    if (err && err.code === 4902) {
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
------------------------------ 
async function getPrices() {
  const ids = [
    "bitcoin",
    "ethereum",
    "base-2",
    "binancecoin",
    "tether",
    "usd-coin",
    "celo-kenyan-shilling"
  ];

  // If you also need KES values for Paystack, include kes in vs_currencies when calling.
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
    ","
  )}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      BTC: data.bitcoin?.usd,
      ETH: data.ethereum?.usd,
      BASE: data["base-2"]?.usd,
      BNB: data.binancecoin?.usd,
      USDT: data.tether?.usd,
      USDC: data["usd-coin"]?.usd,
      mpesa: data["celo-kenyan-shilling"]?.usd
      // Paystack/KES omitted here because this endpoint requests only usd.
    };
  } catch (err) {
    console.error("Price fetch error:", err);
    return null;
  }
} **/

let lastFetchTime = 0;
let cachedPrices = null;

async function getPrices() {
  const now = Date.now();
  // Only fetch if we don't have prices or if the cache is older than 5 minutes (300,000ms)
  if (cachedPrices && (now - lastFetchTime < 300000)) {
    return cachedPrices;
  }

  const ids = ["bitcoin","ethereum","binancecoin","tether","usd-coin","mento-kenyan-shilling"];
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    if (res.status === 429) {
      console.warn("Rate limit hit. Using old prices.");
      return cachedPrices; 
    }
    const data = await res.json();
    cachedPrices = {
      BTC: data.bitcoin?.usd,
      ETH: data.ethereum?.usd,
      BASE: data.ethereum?.usd,
      BNB: data.binancecoin?.usd,
      USDT: data.tether?.usd,
      USDC: data["usd-coin"]?.usd,
      Mpesa: data["mento-kenyan-shilling"]?.usd
    };
    lastFetchTime = now;
    return cachedPrices;
  } catch (err) {
    console.error("Price fetch error:", err);
    return cachedPrices; // Fallback to cache on error
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
      usd: data["celo-kenyan-shilling"]?.usd,
      kes: data["celo-kenyan-shilling"]?.kes
    };
  } catch (e) {
    console.error("CKES price error:", e);
    return null;
  }
}

const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";

/* Preload Prices */
let prices = null,
  kes_prices = null;
(async () => {
  prices = await getPrices();
  kes_prices = await getCKESPrice();
})();

/* -----------------------------
       Unified Token Sender
------------------------------ */
async function sendToken({ token, chain, recipient, amount }) {
  if (!window.ethereum) return alert("MetaMask not found!");

  // 1. Ensure prices are loaded before proceeding
  if (!prices || !prices.ETH) {
    prices = await getPrices();
    if (!prices) return alert("Price data is currently unavailable. Please refresh.");
  }

  try {
    await switchChain(chain);
  } catch (e) {
    console.error("Chain switch error:", e);
    return alert("Unable to switch wallet network: " + e.message);
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const MIN_USD = 1;

  // 2. NaN Protection: Added fallbacks (|| 1) to prevent division by undefined/zero
  const minAmount = {
    ETH: ethers.parseEther((MIN_USD / (prices.ETH || 1)).toFixed(18)),
    BASE: ethers.parseEther((MIN_USD / (prices.BASE || 1)).toFixed(18)),
    BNB: ethers.parseEther((MIN_USD / (prices.BNB || 1)).toFixed(18)),
    ERC20: ethers.parseUnits("1", 6) 
  };

  let parsedAmount;

  /* Native tokens: ETH, BNB, BASE */
  if (["ETH", "BNB", "BASE"].includes(token)) {
    try {
      // 3. Type Fix: amount comes from .value (String). Convert to Number before .toFixed()
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) throw new Error("Amount is NaN");
      
      const safe = numericAmount.toFixed(18);
      parsedAmount = ethers.parseEther(safe);
    } catch (e) {
      return alert("Invalid amount format for native token.");
    }

    const tokenMin = minAmount[token];
    if (tokenMin && parsedAmount < tokenMin) {
      const humanMin = ethers.formatEther(tokenMin);
      return alert(`Min ${token} is ${humanMin}`);
    }

    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parsedAmount
      });
     
      alert(`${token} TX sent: ${tx.hash}`);
      await tx.wait();
      alert(`${token} confirmed!`);
    } catch (err) {
      console.error(`${token} send error:`, err);
      return alert("Transaction failed: " + (err.message || err));
    }
  }

  /* ERC20 on ETH or BASE or BSC */
  else {
    const tokenAddress = TOKEN_ADDRESSES[token]?.[chain];
    if (!tokenAddress)
      return alert(`${token} is not supported on ${chain}`);

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    let decimals = 6;
    try {
      decimals = Number(await contract.decimals());
    } catch (e) {
      console.warn("Could not read token decimals, defaulting to 6:", e);
    }

    try {
      // sanitizeAmount handles the string conversion internally
      const safe = sanitizeAmount(amount, decimals);
      parsedAmount = ethers.parseUnits(safe, decimals);
    } catch (e) {
      return alert("Invalid amount format for ERC20 token.");
    }

    const minERC20 = ethers.parseUnits("10", decimals);
    if (parsedAmount < minERC20) {
      return alert(
        `Amount too low. Min for ${token} is ${ethers.formatUnits(
          minERC20,
          decimals
        )}`
      );
    }

    try {
      const tx = await contract.transfer(recipient, parsedAmount);
      alert(`${token} TX sent: ${tx.hash}`);
      await tx.wait();
      alert(`${token} confirmed!`);
    } catch (err) {
      console.error(`${token} ERC20 transfer error:`, err);
      return alert("Token transfer failed: " + (err.message || err));
    }
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

/* Map select option values (lowercase) to prices object keys (uppercase) */
const OPTION_TO_PRICE_KEY = {
  btc: "BTC",
  eth: "ETH",
  base: "BASE",
  bnb: "BNB",
  usdt: "USDT",
  usdc: "USDC",
  usdt_base: "USDT",
  USDT_BASE: "USDT",
  usdc_base: "USDC",
  mpesa: "Mpesa"
};

async function convertUsdToCrypto() {
  prices = await getPrices();
  const usd = parseFloat(usdInput.value);
  const option = tokenSelect.value;

  if (isNaN(usd)) {
    cryptoOutput.value = "Invalid USD";
    return;
  }

  const priceKey = OPTION_TO_PRICE_KEY[option];
  let result, result_kes;
  if (prices && priceKey && prices[priceKey]) {
    result = usd / prices[priceKey];
    result_kes = usd / prices[priceKey];
  } else {
    result = usd / (prices?.BTC || 1);
    result_kes = usd / (prices?.mpesa || 1);
  }

  cryptoOutput.value = result.toString();

  if (option === "mpesa") {
    cryptoTo.innerText = "KES";
    mpesa_amount.value = result_kes.toFixed(0);
  } else if (option === "paystack") {
    cryptoTo.innerText = "USD";
    cryptoOutput.value = usd;
    kes_amount.value = usd;
  } else if (option === "btc") {
    cryptoTo.innerText = "BTC";
    cryptoOutput.value = result.toFixed(6);
  } else {
    cryptoTo.innerText = option.toUpperCase();
    cryptoOutput.value = result.toFixed(10);
  }
}

/* Live updates */
usdInput.onchange = convertUsdToCrypto;
tokenSelect.onchange = convertUsdToCrypto;
convertUsdToCrypto();

/* -----------------------------
         CONNECT METAMASK
------------------------------ */
let provider, signer;
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
  const option = document.getElementById("payment_method").value.toLowerCase();

  if (option === "eth")
    return sendToken({
      token: "ETH",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });
  if (option === "btc") {
  //showBTC(amount);
  const _usd = document.getElementById("usd").value;
  openBtcPopup(_usd, amount);
  return;
}

  if (option === "base")
    return sendToken({
      token: "BASE",
      chain: "base",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "usdc")
    return sendToken({
      token: "USDC",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "usdt")
    return sendToken({
      token: "USDT",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });

  /* BASE MAINNET USDT / USDC */
  if (option === "usdc_base")
    return sendToken({
      token: "USDC",
      chain: "base",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "usdt_base")
    return sendToken({
      token: "USDT",
      chain: "base",
      recipient: ETH_ADDRESS,
      amount
    });

  if (option === "bnb")
    return sendToken({
      token: "BNB",
      chain: "bsc",
      recipient: ETH_ADDRESS,
      amount
    });

  const email = localStorage.getItem("tmx_gold_name") || localStorage.getItem("name");
  const from = document.getElementById("wallet_address")?.value || "";

  if (option === "mpesa") {
    // 1. Collect all required data for your backend body
    const amountKES = document.getElementById("mpesa_amount").value;
    const usdValue = document.getElementById("usd").value; // The USD input
    const tokenAmount = document.getElementById("amount").value; // The crypto amount to send
     //let _amount = parseFloat(usdValue/0.005).toFixed(0);
      //_amount = parseInt(_amount * 1e18).toString();
    const pricePerToken = 0.005; // Example price per token in USD, replace with actual logic if needed
    let _amount = ethers.parseUnits(usdValue / pricePerToken, 18);
    const userEmail = "tony@tmxglobal.com"; // Hardcoded email for testing
    const walletAddress = document.getElementById("wallet_address").value;

    // 2. Trigger Paystack M-Pesa Flow
    // Note: You must use the Paystack Inline JS to get a 'reference' first
    const handler = PaystackPop.setup({
        key: 'pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2', // Replace with your public key
        email: userEmail,
        amount: Math.round(amountKES * 100), // Paystack expects subunits (kobo/cents)
        currency: "KES",
        metadata: {
            custom_fields: [{ display_name: "Wallet Address", variable_name: "wallet", value: walletAddress }]
        },
        onClose: function() {
            alert('Transaction cancelled.');
        },
         onSuccess: (response) => {
        // Handle the async backend call here
        handleMpesa(response);
    }
            // response.reference is the ID generated by Paystack
            

            // 3. Match your Backend route: /verify-mpesa
           
        
    });
    
    async function handleMpesa(response) {
       try {
                const verifyRes = await fetch(`${AUTH_BACKEND_URL}/api/payments/verify-mpesa`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        reference: paystackReference, 
                        address: walletAddress, 
                        email: userEmail, 
                        amount: amountKES, 
                        token: _amount, 
                        usd: usdValue 
                    })
                });

                const result = await verifyRes.json();

                if (result.status === "success") {
                    document.getElementById("status").textContent = "✅ Payment Confirmed & Tokens Sent!";
                    document.getElementById("status").className = "confirmed";
                    alert("Success! Tokens have been dispatched to your wallet.");
                } else {
                    alert("Verification failed: " + (result.data?.message || "Unknown error"));
                }
            } catch (e) {
                console.error("Verification Error:", e);
                alert("Error connecting to server for verification.");
            }
    }

    handler.open();
    return; // Payment verification is handled in the Paystack callback above
  }

  if (option === "paystack") {
    // Usually Paystack requires a popup or redirect
    const userEmail = "tony@tmxglobal.com"; // Hardcoded email for testing
    return setupPaystackPayment(userEmail, amount);
  }
    //const _token = 
    startPaymentPolling(option, email, from, amount);

  /* Remaining (Mpesa, Paystack, BTC, Bank, Wire) unchanged */
}

function setupPaystackPayment(email, amount) {
    const amountKES = document.getElementById("paystackAmount").value;
    const usdValue = document.getElementById("usd").value; // The USD input
    //let _amount = parseFloat(usdValue/0.005).toFixed(0);
   
   // _amount = parseInt(_amount * 1e18).toString(); // Convert to wei for ERC20 tokens
    const pricePerToken = 0.005; // Example price per token in USD, replace with actual logic if needed
    let _amount = ethers.parseUnits(usdValue / pricePerToken, 18);
    const tokenAmount = document.getElementById("amount").value; // The crypto amount to send
    // Hardcoded email for testing
    const walletAddress = document.getElementById("wallet_address").value;
  //email = 

  /**) {
      alert('Payment successful! Reference: ' + response.reference);
      const paystackReference = response.reference;
      // Here you would notify your backend
      try {
                const verifyRes = await fetch(`${AUTH_BACKEND_URL}/api/payments/paystack`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        reference: paystackReference, 
                        address: walletAddress, 
                        email: email, 
                        amount: amountKES, 
                        token: _amount, 
                        usd: usdValue 
                    })
                });

                const result = await verifyRes.json();

                if (result.status === "success") {
                    document.getElementById("status").textContent = "✅ Payment Confirmed & Tokens Sent!";
                    document.getElementById("status").className = "confirmed";
                    alert("Success! Tokens have been dispatched to your wallet.");
                } else {
                    alert("Verification failed: " + (result.data?.message || "Unknown error"));
                }
            } catch (e) {
                console.error("Verification Error:", e);
                alert("Error connecting to server for verification.");
            }
    }
  }); **/
  const handler = PaystackPop.setup({
    key: 'pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2',
    email: email,
    amount: Math.round(amount * 100),
    currency: "USD",
    onClose: () => alert('Window closed.'),
    onSuccess: (response) => {
        // Handle the async backend call here
        handleVerification(response);
    }
});
  handler.open();

  async function handleVerification(response) {
    const paystackReference = response.reference;
    try {
        const verifyRes = await fetch(`${AUTH_BACKEND_URL}/api/payments/paystack`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                reference: paystackReference, 
                address: walletAddress, 
                email: email, 
                amount: amountKES, 
                token: _amount, 
                usd: usdValue 
            })
        });
        
        // ... handle result
         const result = await verifyRes.json();

                if (result.status === "success") {
                    document.getElementById("status").textContent = "✅ Payment Confirmed & Tokens Sent!";
                    document.getElementById("status").className = "confirmed";
                    alert("Success! Tokens have been dispatched to your wallet.");
                } else {
                    alert("Verification failed: " + (result.data?.message || "Unknown error"));
                }
    } catch (e) {
        console.error("Verification Error:", e);
    }
}
}

document.getElementById("btnBuyTokens").onclick = sendSelectedToken;

/* -----------------------------
      CHECK PAYMENT STATUS
------------------------------ */


async function checkPayment(crypto, email, from, amount, address, token) {
  try {
    const res = await fetch(`${AUTH_BACKEND_URL}/api/payments/${crypto}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount, from })
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("API error:", res.status, text);
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Server returned non-JSON:", text);
      return;
    }

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

/** async function checkPayment(crypto, email, from, amount) {
  try {
    if(crypto !== "paystack" && crypto !== "mpesa" && crypto !== "bank" && crypto !== "wire"){
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
    }  **/
   /** const res = await fetch(`${AUTH_BACKEND_URL}/api/payments/${crypto}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}` // if required
  },
  body: JSON.stringify({ email, amount, from })
});

if (!res.ok) {
  const text = await res.text();
  console.error("Server error:", text);
  throw new Error(`HTTP ${res.status}`);
}

const data = await res.json();
  }
  } catch (err) {
    console.error("Payment check error:", err);
  }

} **/

function showBTC(amount) {
  document.getElementById("btcAmount").innerText =
    "Amount: " + amount + " BTC";
  document.getElementById("btcModal").style.display = "block";
}

function openBtcPopup(usd, btc) {
  const url = `/btc.html?usd=${encodeURIComponent(usd)}&btc=${encodeURIComponent(btc)}`;
  const popup = window.open(url, "btcPopup", "width=600,height=520,resizable=no");
  if (popup) popup.focus();
}

function closeBTC() {
  document.getElementById("btcModal").style.display = "none";
}


/* -----------------------------
      AUTO POLL PAYMENT ( min)
------------------------------ */

let polling = null;

/** function startPaymentPolling(crypto, email, from, amount) {
  // Clear old interval if running
  if (polling) clearInterval(polling);

  // Run immediately
  if (crypto === "btc"){
  checkPayment(crypto, email, from, amount);
  }
  // Then run every 60 seconds
  polling = setInterval(() => {
    checkPayment(crypto, email, from, amount);
  }, 60 * 5 * 1000);
}**/

function startPaymentPolling(crypto, email, from, amount) {
  if (polling) clearInterval(polling);

  const SUPPORTED = ["eth", "usdt", "usdc", "base", "bnb", "usdt_base", "usdc_base"];

  if (!SUPPORTED.includes(crypto)) {
    console.warn("No backend support for:", crypto);
    return;
  }
  const address = document.getElementById("wallet_address").value;
  let token = document.getElementById("usd").value;
  token = parseFloat(token/0.005).toFixed(0);
  token = parseInt(token * 1e18).toString(); // Convert to wei for ERC20 tokens
 
  checkPayment(crypto, email, from, amount, address, token);

  polling = setInterval(() => {
    checkPayment(crypto, email, from, amount, address, token);
  }, 60 * 1000);
}


document.addEventListener('DOMContentLoaded', function() {
    const paymentMethodSelect = document.getElementById('payment_method');
    const paymentFields = document.getElementById('paymentFields');

    paymentMethodSelect.addEventListener('change', function() {
        // Get the currently selected option
        const selectedOption = this.options[this.selectedIndex];
        
        // Get the 'data-method' attribute value
        const dataMethod = selectedOption.getAttribute('data-method');

        // Logic: Show if data-method exists and matches a specific value 
        // Or simply show if ANY method is selected
        if (dataMethod && dataMethod !== "") {
            paymentFields.style.display = 'block';
            // Optional: Add animation class if your CSS supports it
            paymentFields.classList.add('animated', 'fadeIn'); 
        } else {
            paymentFields.style.display = 'none';
        }
    });
});