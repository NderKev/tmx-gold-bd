/* ============================================================
   BASE MAINNET – PAYMENT + TOKEN SENDER SCRIPT
   Avalanche removed, Base added
============================================================ */

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
------------------------------ */
async function getPrices() {
  const ids = [
    "bitcoin", // BTC
    "ethereum", // ETH
    "tether", // USDT
    "usd-coin", // USDC
    "binancecoin", // BNB
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

const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
  ? "http://localhost:7000"
  : "https://tmxgoldcoin.co";

const PAYSTACK_PUBLIC_KEY = window.location.hostname === "localhost"
  ? "pk_test_105d838cb4031bcd7f7a81c685193c75ce34e47e"
  : "pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2";

const PAYSTACK_CARD_CURRENCY =
  localStorage.getItem("paystack_card_currency") ||
  (window.location.hostname === "localhost" ? "GHS" : "USD");

const PAYSTACK_MPESA_CURRENCY =
  localStorage.getItem("paystack_mpesa_currency") ||
  (window.location.hostname === "localhost" ? "GHS" : "KES");

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

  if (!prices) {
    // try to refresh prices if they weren't loaded
    prices = await getPrices();
    if (!prices) return alert("Unable to fetch prices. Try again later.");
  }

  try {
    await switchChain(chain);
  } catch (e) {
    console.error("Chain switch error:", e);
    return alert("Unable to switch wallet network: " + e.message);
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Minimum USD threshold for native tokens (e.g. require at least $10 worth)
  const MIN_USD = 10;

  // Compute native minimum amounts in wei (BigInt) using current prices.
  // Note: ethers.parseEther expects a decimal string.
  const minAmount = {
    ETH:
      typeof prices.ETH === "number"
        ? ethers.parseEther((MIN_USD / prices.ETH).toString())
        : ethers.parseEther("0"),
    BASE:
      typeof prices.BASE === "number"
        ? ethers.parseEther((MIN_USD / prices.BASE).toString())
        : ethers.parseEther("0"),
    BNB:
      typeof prices.BNB === "number"
        ? ethers.parseEther((MIN_USD / prices.BNB).toString())
        : ethers.parseEther("0"),
    // ERC20 min amount (10 units) in token subunits — default using 6 decimals (will be overridden by actual token decimals)
    ERC20: ethers.parseUnits("10", 6)
  };

  let parsedAmount;

  /* Native tokens: ETH, BNB, BASE */
  if (["ETH", "BNB", "BASE"].includes(token)) {
    // parseEther works for 18-decimal native tokens (ETH/BASE/BNB)
    try {
      parsedAmount = ethers.parseEther(amount.toString());
    } catch (e) {
      return alert("Invalid amount format for native token.");
    }

    // ensure we compare BigInts
    const tokenMin = minAmount[token];
    if (tokenMin && parsedAmount < tokenMin) {
      // format min back to human-readable amount
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

    // create contract connected to signer
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

    // get decimals from contract (fallback to 6 if the call fails)
    let decimals = 6;
    try {
      decimals = Number(await contract.decimals());
    } catch (e) {
      console.warn("Could not read token decimals, defaulting to 6:", e);
    }

    try {
      parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    } catch (e) {
      return alert("Invalid amount format for ERC20 token.");
    }

    // compute correct minimum for ERC20 using the token's decimals if needed
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
      // contract.transfer returns a transaction response object
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

async function convertUsdToCrypto() {
  prices = await getPrices();
  const usd = parseFloat(usdInput.value);
  const option = tokenSelect.value;
  const normalizedOption = (option || "").toLowerCase();

  if (isNaN(usd)) {
    cryptoOutput.value = "Invalid USD";
    return;
  }

  let result, result_kes;
  if (prices && prices[option]) {
    result = usd / prices[option];
    result_kes = usd / prices[option];
  } else {
    result = usd / (prices?.BTC || 1);
    result_kes = usd / (prices?.mpesa || 1);
  }

  cryptoOutput.value = result.toString();

  if (normalizedOption === "mpesa") {
    cryptoTo.innerText = "KES";
    mpesa_amount.value = result_kes.toFixed(0);
  } else if (normalizedOption === "paystack") {
    cryptoTo.innerText = "USD";
    cryptoOutput.value = usd;
    kes_amount.value = usd;
  } else if (normalizedOption === "btc") {
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

tokenSelect.addEventListener("change", function () {
  const paystackFields = document.getElementById("paystackFields");
  if (paystackFields) {
    paystackFields.style.display = this.value === "paystack" ? "block" : "none";
  }

  const mpesaFields = document.querySelector('.method-fields[data-method="Mpesa"]');
  if (mpesaFields) {
    mpesaFields.style.display = this.value === "mpesa" ? "block" : "none";
  }
});

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

  if (option === "paystack") {
    const address = document.getElementById("wallet_address")?.value;
    const email = document.getElementById("paystackEmail")?.value;
    const usd = Number(document.getElementById("paystackAmount")?.value);

    if (!address || !email || !usd) {
      alert("Please enter wallet address and Paystack amount.");
      return;
    }

    const token = usd / 0.005;

    if (typeof PaystackPop === "undefined") {
      alert("Paystack is not available.");
      return;
    }

    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(usd * 100),
      currency: PAYSTACK_CARD_CURRENCY,
      ref: "" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        (async () => {
          try {
            const resp = await fetch(`${AUTH_BACKEND_URL}/tmxGold/v1/payments/paystack`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                reference: response.reference,
                address,
                email,
                amount: usd,
                token,
                usd,
              }),
            });

            const data = await resp.json().catch(() => ({}));
            if (resp.ok && data && data.success) {
              alert("Payment verified successfully");
            } else {
              alert(data?.message || "Payment verification failed");
            }
          } catch (e) {
            console.error("Paystack verification error:", e);
            alert("Error verifying payment");
          }
        })();
      },
      onClose: function () {
        alert("Transaction was not completed, window closed.");
      },
    });

    handler.openIframe();
    return;
  }

  if (option === "mpesa") {
    const address = document.getElementById("wallet_address")?.value;
    const email = document.getElementById("paystackEmail")?.value;
    const kes = Number(document.getElementById("mpesa_amount")?.value);
    const usd = Number(document.getElementById("usd")?.value);

    if (!address || !email || !kes) {
      alert("Please enter wallet address and Mpesa amount.");
      return;
    }

    const token = (usd || 0) / 0.005;

    if (typeof PaystackPop === "undefined") {
      alert("Paystack is not available.");
      return;
    }

    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(kes * 100),
      currency: PAYSTACK_MPESA_CURRENCY,
      ref: "" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        (async () => {
          try {
            const resp = await fetch(`${AUTH_BACKEND_URL}/tmxGold/v1/payments/verify-mpesa`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                reference: response.reference,
                address,
                email,
                amount: kes,
                token,
                usd,
              }),
            });

            const data = await resp.json().catch(() => ({}));
            if (resp.ok && data && (data.success || data.status === "success")) {
              alert("Payment verified successfully");
            } else {
              alert(data?.message || "Payment verification failed");
            }
          } catch (e) {
            console.error("Mpesa verification error:", e);
            alert("Error verifying payment");
          }
        })();
      },
      onClose: function () {
        alert("Transaction was not completed, window closed.");
      },
    });

    handler.openIframe();
    return;
  }

  if (option === "eth")
    return sendToken({
      token: "ETH",
      chain: "ethereum",
      recipient: ETH_ADDRESS,
      amount
    });
  if (option === "btc") {
  //showBTC(amount);
  openBtcPopup(amount, amount);
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
    const email = localStorage.getItem("name");
    const from = document.getElementById("wallet_address");
    //const _token = 
    startPaymentPolling(option, email, from?.value, amount);

<<<<<<< HEAD
  /* Remaining (Mpesa, Paystack, BTC, Bank, Wire) unchanged */
=======
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
        const verifyRes = await fetch(`${AUTH_BACKEND_URL}/tmxGold/v1/api/payments/paystack`, {
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
>>>>>>> bcbb8092b092ce65ca1fae3f6c5589a36e08f590
}

document.getElementById("btnBuyTokens").onclick = sendSelectedToken;

/* -----------------------------
      CHECK PAYMENT STATUS
------------------------------ */


async function checkPayment(crypto, email, from, amount) {
  try {
<<<<<<< HEAD
    const routeCrypto = crypto === "base" ? "eth" : crypto;
    const res = await fetch(`${AUTH_BACKEND_URL}/tmxGold/v1/payments/${routeCrypto}`, {
=======
    const res = await fetch(`${AUTH_BACKEND_URL}/tmxGold/v1/api/payments/${crypto}`, {
>>>>>>> bcbb8092b092ce65ca1fae3f6c5589a36e08f590
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

let polling = 10;

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

  const SUPPORTED = ["eth", "usdt", "usdc", "base", "bnb"];
  if (!SUPPORTED.includes(crypto)) {
    console.warn("Unsupported payment method for polling:", crypto);
    return;
  }

  checkPayment(crypto, email, from, amount);

  polling = setInterval(() => {
    checkPayment(crypto, email, from, amount);
  }, 60 * 1000);
}