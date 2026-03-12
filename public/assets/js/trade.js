$(document).ready(function(){
let tradeIndex = document.getElementById("tradeIndex");
let tradeTrading = document.getElementById("tradeTrade")
let tradeICO = document.getElementById("tradeICO")
let tradeUser = document.getElementById("tradeUser")
let tradeBuy = document.getElementById("tradeBuy")
let tradeGateways = document.getElementById("tradeGateways")
let tradeAffiliate = document.getElementById("tradeAffiliate")
let tradeWallet = document.getElementById("tradeWallet")
let tradeSecurity = document.getElementById("tradeSecurity")
let tradeSettings = document.getElementById("tradeSettings")
let tradeAccount = document.getElementById("tradeAccount")
let tradeFaq = document.getElementById("tradeFaq")
let tradeSupport = document.getElementById("tradeSupport")
let accountTrade = document.getElementById("accountTrade")
let tradeProfile = document.getElementById("tradeProfile")
let supportTrade = document.getElementById("supportTrade")
let tradeTransactions = document.getElementById("tradeTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(tradeIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(tradeTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(tradeICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(tradeUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(tradeBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(tradeGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(tradeAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(tradeWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(tradeSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(tradeSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(tradeAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(tradeFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(tradeSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountTrade).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(tradeProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportTrade).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(tradeTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');

  const data = [
    { y: '2024-10', btc: 1000, dush: 900 },
    { y: '2024-11', btc: 1170, dush: 970 },
    { y: '2024-12', btc: 1250, dush: 980 },
    { y: '2025-01', btc: 1300, dush: 1010 },
    { y: '2025-02', btc: 1450, dush: 1025 },
    { y: '2025-03', btc: 1600, dush: 1080 },
    { y: '2025-04', btc: 1750, dush: 1120 }
  ];

  // Render Chart
  Morris.Area({
    element: 'db_morris_area_graph',
    data: data,
    xkey: 'y',
    ykeys: ['btc', 'dush'],
    labels: ['BTC Earning', 'DUSH Rate'],
    lineColors: ['#7a6fbe', '#28bbe3'],
    pointSize: 3,
    fillOpacity: 0.5,
    behaveLikeLine: true,
    gridLineColor: '#eef0f2',
    hideHover: 'auto',
    resize: true
  });
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
      dataType: "JSON",
      contentType: "application/json",
      method: "GET",
      xhrFields: { withCredentials: true },
      error: (err) => {
        if (err.status === 401){
        alert("Session Expired! Kindly login again");
        localStorage.setItem('tmx_gold_name', "");
        localStorage.setItem('role', "");
        localStorage.setItem('token', "");
        window.location.href = "/index.html";
      }
      },
      success: function(results){

      }
    });
  }, 30000);


document.addEventListener('DOMContentLoaded', function () {
  const role = localStorage.getItem('role');   // e.g. "admin" or "customer"

  if (role === 'customer') {
    // Option 1: completely remove the element
    document.getElementById('icoMenu').remove();
    document.getElementById('paymentMenu').remove();

    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
});


const BASE_RPC = "https://mainnet.base.org";
const BASE_CHAIN_ID = "0x2105";

    // Example ERC20 token (USDC.e on Avalanche)
 const TOKEN_ADDRESS = "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8";
    const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

    const ERC20_ABI_TMXGT = [ 
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "addedValue", "type": "uint256" }
    ],
    "name": "increaseAllowance",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "account", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "value", "type": "uint256" }],
    "name": "burn",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "addMinter",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceMinter",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "subtractedValue", "type": "uint256" }
    ],
    "name": "decreaseAllowance",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "isMinter",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "name": "newMinter", "type": "address" }],
    "name": "transferMinterRole",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "name", "type": "string" },
      { "name": "symbol", "type": "string" },
      { "name": "decimals", "type": "uint8" },
      { "name": "initialSupply", "type": "uint256" },
      { "name": "feeReceiver", "type": "address" },
      { "name": "tokenOwnerAddress", "type": "address" }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "name": "account", "type": "address" }],
    "name": "MinterAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "name": "account", "type": "address" }],
    "name": "MinterRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "owner", "type": "address" },
      { "indexed": true, "name": "spender", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  }
];

const address = document.getElementById("wallet_address");
//const balance = document.getElementById("wallet_balance");
//const output = document.getElementById("output");
//const network = document.getElementById("network");
const balanceWei = document.getElementById("wallet_balance");
const balanceUsd = document.getElementById("wallet_usd");

let provider, signer, token, decimals, symbol;


  async function switchToBase() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_CHAIN_ID }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: BASE_CHAIN_ID,
                  chainName: "Base Mainnet",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18
                  },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org/"]
                }
              ]
            });
          } catch (addError) {
            console.error("Add chain error:", addError);
          }
        } else {
          console.error("Switch error:", switchError);
        }
      }
}


    async function checkNetwork() {
        const { chainId } = await provider.getNetwork();
        const hexId = "0x" + chainId.toString(16);

        if (hexId !== BASE_CHAIN_ID) {
          alert(`Wrong network! Please switch MetaMask to Base Mainnet (chainId: 8453).`);
          await switchToBase();
          return false;
        }

       // network.innerText = `Base Mainnet (chainId ${chainId})`;
        return true;
      }


  async function loadBalance() {
      try {
        const account = signer.address;
        address.innerText = account;

        const rawBalance = await token.balanceOf(account);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        const usd_balance = parseFloat(formatted * 0.005);

        //balance.innerText = `${formatted} ${symbol}`;
        balanceWei.innerText = `${formatted} TMXGT`;
        balanceUsd.innerText = `${usd_balance} USD`;

      } catch (err) {
        console.error("Error loading balance:", err);
        output.innerText = "Balance: error";
  }
}

  document.addEventListener("DOMContentLoaded", function () {
  connect();
});

async function connect() {
  if (!window.ethereum) return alert("Install MetaMask!");

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();
  console.log("Signer:", signer.address);

  if (!(await checkNetwork())) return;

  token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI_TMXGT, provider);
  decimals = await token.decimals();
  symbol = await token.symbol();

  await loadBalance();

  window.ethereum.on("accountsChanged", async () => {
    signer = await provider.getSigner();
    await loadBalance();
  });

  window.ethereum.on("chainChanged", async () => {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI_TMXGT, provider);
    await loadBalance();
  });
}

$("#transferButton").click(async (e)  => {
  e.preventDefault();

  // Get input values
  const amount = $("#tmxgt_amount").val().trim();
  const recipient = $("#tmxgt_address").val().trim();

  // Validate inputs
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (!recipient) {
    alert("Please enter a recipient address");
    return;
  }

  // Validate recipient address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
    alert("Invalid recipient address. Please enter a valid Ethereum address starting with 0x");
    return;
  }

  try {
    // Convert amount to wei (assuming 18 decimals for ETH)
    const amountWei = ethers.parseUnits(amount, 18);

    // Get sender address from signer (connected wallet)
    const sender = signer.address;

    // Check if sender has sufficient balance
    let balance = await provider.getBalance(sender);
    balance = ethers.formatUnits(balance, 18);
    console.log(`Sender balance: ${balance} ETH`);


    if (balance < amountWei) {
      alert("Insufficient balance for this transfer");
      return;
    }

    // Confirm transfer with user
    const confirmTransfer = confirm(`Send ${amount} ETH to ${recipient}?`);
    if (!confirmTransfer) return;

    // Send transaction via MetaMask
    const tx = await signer.sendTransaction({
      to: recipient,
      value: amountWei
    });

    // Show transaction hash to user
    console.log("Transaction sent:", tx.hash);
    alert(`Transfer initiated! Transaction hash: ${tx.hash}\n\nPlease wait for confirmation.`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    alert("Transfer completed successfully!");
    //'email', 'address', 'tx_hash', 'mode', 'type', 'to', 'status', 'value', 'usd'
    const email = localStorage.getItem("tmx_gold_name");
    const address = $("#wallet_address").val().trim();
    const value = amountWei.toString();
    const usd = parseFloat(amount) * 0.005; // Assuming 1 TMXGT = 0.005 USD
    const tx_hash = tx.hash;
    const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : "https://tmxgoldcoin.co";
    const res = await fetch(`${AUTH_BACKEND_URL}/api/tx/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, address, tx_hash, mode: "eth", type: "transfer", to: recipient, status: "complete", value, usd   })
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("API error:", res.status, text);
      return;
    }
    // Reload balance after transfer
    await loadBalance();

  } catch (err) {
    console.error("Transfer error:", err);
    
    // Handle specific error cases
    if (err.code === 4001) {
      alert("Transaction rejected by user");
    } else if (err.message && err.message.includes("insufficient funds")) {
      alert("Insufficient funds for this transfer");
    } else {
      alert(`Transfer failed: ${err.message || "Unknown error"}`);
    }
  }

});

