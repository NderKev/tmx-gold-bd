$(document).ready(function(){
let securityIndex = document.getElementById("securityIndex");
let securityTrading = document.getElementById("securityTrade")
let securityICO = document.getElementById("securityICO")
let securityUser = document.getElementById("securityUser")
let securityBuy = document.getElementById("securityBuy")
let securityGateways = document.getElementById("securityGateways")
let securityAffiliate = document.getElementById("securityAffiliate")
let securityWallet = document.getElementById("securityWallet")
let securitySecurity = document.getElementById("securitySecurity")
let securitySettings = document.getElementById("securitySettings")
let securityAccount = document.getElementById("securityAccount")
let securityFaq = document.getElementById("securityFaq")
let securitySupport = document.getElementById("securitySupport")
let accountSecurity = document.getElementById("accountSecurity")
let securityProfile = document.getElementById("securityProfile")
let supportSecurity = document.getElementById("supportSecurity")
let securityTransactions = document.getElementById("securityTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(securityIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(securityTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(securityICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(securityUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(securityBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(securityGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(securityAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(securityWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(securitySecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(securitySettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(securityAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(securityFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(securitySupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(securityProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(securityTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
      dataType: "JSON",
      contentType: "application/json",
      method: "GET",
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
  }, 1800000);


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


const AVALANCHE_RPC = "https://api.avax.network/ext/bc/C/rpc";
const AVALANCHE_CHAIN_ID = "0xa86a";

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
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "recipient",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
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
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "recipient",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isMinter",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newMinter",
        "type": "address"
      }
    ],
    "name": "transferMinterRole",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "symbol",
        "type": "string"
      },
      {
        "name": "decimals",
        "type": "uint8"
      },
      {
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "name": "feeReceiver",
        "type": "address"
      },
      {
        "name": "tokenOwnerAddress",
        "type": "address"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "MinterAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "account",
        "type": "address"
      }
    ],
    "name": "MinterRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  }
];
 const address = document.getElementById("address");
 const balance = document.getElementById("balance");
 const balanceUsd = document.getElementById("usd_balance");

 let provider, signer, token, decimals, symbol;

      async function switchToAvalanche() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: AVALANCHE_CHAIN_ID }]
        });
      } catch (switchError) {
        // If chain not added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: AVALANCHE_CHAIN_ID,
                  chainName: "Avalanche C-Chain",
                  nativeCurrency: {
                    name: "Avalanche",
                    symbol: "AVAX",
                    decimals: 18
                  },
                  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                  blockExplorerUrls: ["https://snowtrace.io/"]
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
      if (hexId !== AVALANCHE_CHAIN_ID) {
        alert(`Wrong network! Please switch MetaMask to Avalanche C-Chain (chainId: 43114).`);
        await switchToAvalanche();
        //return false;
        return false;
      }
      network.innerText = `Avalanche (chainId ${chainId})`;
      return true;
    }

    async function loadBalance() {
      try {
        const account = signer.address;
        address.innerText =  account;
        //wallet.innerText = account;

        const rawBalance = await token.balanceOf(account);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        const usd_balance = parseFloat(formatted * 0.005);

        balance.innerText = `${formatted} TMXGT`;
        //balanceWei.innerText = `${formatted} TMXGT`;
        balanceUsd.innerText = `${usd_balance} USD`;
      } catch (err) {
        console.error("Error loading balance:", err);
        output.innerText = "Balance: error";
      }
    }

  document.addEventListener("DOMContentLoaded", function () {
    connect();
  })

    async function connect() {
      if (!window.ethereum) return alert("Install MetaMask!");
       
      //provider = new ethers.providers.Web3Provider(window.ethereum);
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      console.log("Signer address:", signer.address);
      if (!(await checkNetwork())) return;
      token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI_TMXGT, provider);
      decimals = await token.decimals();
      symbol = await token.symbol();

      await loadBalance();

      // Refresh when account changes
      window.ethereum.on("accountsChanged", async () => {
        signer = await provider.getSigner();
        await loadBalance();
      });

      // Refresh when network changes
      window.ethereum.on("chainChanged", async () => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI_TMXGT, provider);
        await loadBalance();
      });
    }

     //connectBtn.onclick = connect;

  //const fullAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // example
  const addressEl = document.getElementById("address");
  //const addressCp = document.getElementById("copy_address");

  // Display shortened address
  function shortenAddress(addressEl) {
    return addressEl.slice(0, 6) + "…" + addr.slice(-4);
  }
