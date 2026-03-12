$(document).ready(function(){
let userIndex = document.getElementById("userIndex");
let userTrading = document.getElementById("userTrade")
let userICO = document.getElementById("userICO")
let userUser = document.getElementById("userUser")
let userBuy = document.getElementById("userBuy")
let userGateways = document.getElementById("userGateways")
let userAffiliate = document.getElementById("userAffiliate")
let userWallet = document.getElementById("userWallet")
let userSecurity = document.getElementById("userSecurity")
let userSettings = document.getElementById("userSettings")
let userAccount = document.getElementById("userAccount")
let userFaq = document.getElementById("userFaq")
let userSupport = document.getElementById("userSupport")
let accountUser = document.getElementById("accountUser")
let userProfile = document.getElementById("userProfile")
let supportUser = document.getElementById("supportUser")
let userTransactions = document.getElementById("userTransactions")
let BecomeAffiiliate = document.getElementById("BecomeAffiiliate");
let BuyandSell = document.getElementById("BuyandSell");


var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(userIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(userTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(userICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(userUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(userBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(userGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(userAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(userWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(userSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(userSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(userAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(userFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(userSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountUser).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(userProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportUser).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(userTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
$(BecomeAffiiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(BuyandSell).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
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

const address = document.getElementById("tmxgtAddress");
//const balance = document.getElementById("wallet_balance");
//const output = document.getElementById("output");
//const network = document.getElementById("network");
//const balanceWei = document.getElementById("wallet_balance");
//const balanceUsd = document.getElementById("wallet_usd");

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

       

       const balance = await provider.getBalance(account);

        document.getElementById("eth_balance").innerText =
          ethers.formatEther(balance) + " ETH";
        document.getElementById("eth_balance_number").value = ethers.formatEther(balance);

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

$("#buyTokensButton").click(async (e)  => {
  e.preventDefault();
  const ethBalanceElement = document.getElementById("eth_balance_number");  
  const ethBalance = parseFloat(ethBalanceElement.value);
  let tokenAmount = document.getElementById("tmxgtAmount").value;
  const address = document.getElementById("tmxgtAddress").value;
  tokenAmount = Math.pow(tokenAmount, 18);
  const expectedEthWei = tokenAmount * 2616150800000; // Assuming 1 TMXGT = 0.01 ETH
  const email = localStorage.getItem("tmx_gold_name");
  if (!ethBalance || ethBalance <= 0) {
    alert("Your ETH balance is too low to make a purchase. Please deposit more ETH and try again.");
    return;
  }
  if (!tokenAmount || tokenAmount <= 0) {
    alert("Please enter a valid token amount greater than 0");
    return;
  }

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    alert("Please enter a valid Ethereum address");
    return;
  }

  try {
    const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
      ? "http://localhost:7000"
      : 'https://tmxgoldcoin.co';

    const response = await fetch(`${AUTH_BACKEND_URL}/api/payments/buyTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tokenAmount, expectedEthWei, email, address}),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Purchase successful! Transaction Hash: " + data.txHash);
    } else {
      alert("Purchase failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    alert("An error occurred: " + (error?.message || String(error)));
  }
});
