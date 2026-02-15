// --------------------------- BASE CONFIG ---------------------------

// Base Mainnet RPC
const BASE_RPC = "https://mainnet.base.org";
const BASE_CHAIN_ID = "0x2105"; // 8453 in hex

// TMXGT Token on Base (replace with your actual Base deployment)
const TOKEN_ADDRESS = "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8";

// ERC20 ABI (short)
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Full TMXGT ABI (unchanged)
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
]
;

// --------------------------- UI ELEMENTS ---------------------------
const address = document.getElementById("address");
const balance = document.getElementById("balance");
const output = document.getElementById("output");
const network = document.getElementById("network");
const balanceWei = document.getElementById("wallet_balance");
const balanceUsd = document.getElementById("wallet_usd");
const wallet  = document.getElementById("wallet_address");
const connectBtn = document.getElementById("connectWalletMain");

let provider, signer, token, decimals, symbol;

// --------------------------- SWITCH TO BASE ---------------------------
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
                name: "Ether",
                symbol: "ETH",
                decimals: 18
              },
              rpcUrls: [BASE_RPC],
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

// --------------------------- NETWORK CHECK ---------------------------
async function checkNetwork() {
  const { chainId } = await provider.getNetwork();
  const hexId = "0x" + chainId.toString(16);

  if (hexId !== BASE_CHAIN_ID) {
    alert(`Wrong network! Please switch MetaMask to Base Mainnet (chainId: 8453).`);
    await switchToBase();
    return false;
  }

  network.innerText = `Base Mainnet (chainId ${chainId})`;
  return true;
}

// --------------------------- LOAD BALANCE ---------------------------
async function loadBalance() {
  try {
    const account = signer.address;

    address.innerText = account;
    wallet.innerText = account;
    localStorage.setItem('address', account);

    const rawBalance = await token.balanceOf(account);
    const formatted = ethers.formatUnits(rawBalance, decimals);

    balance.innerText = `${formatted} ${symbol}`;
  } catch (err) {
    console.error("Error loading balance:", err);
    output.innerText = "Balance: error";
  }
}

// --------------------------- CONNECT WALLET ---------------------------
async function connect() {
  if (!window.ethereum) return alert("Install MetaMask!");

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  console.log("Signer address:", signer.address);

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

connectBtn.onclick = connect;

// --------------------------- ADDRESS & COPY HANDLERS ---------------------------
function shortenAddress(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

document.getElementById("address").addEventListener("click", function() {
  const addr = document.getElementById("address").textContent;
  navigator.clipboard.writeText(addr).then(() => {
    const toast = document.getElementById("copyToast");
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.style.visibility = "hidden", 300);
    }, 2000);
  });
});

document.getElementById("copy_address").addEventListener("click", function() {
  const addr = document.getElementById("address").textContent;
  navigator.clipboard.writeText(addr).then(() => {
    const toast = document.getElementById("copyToast");
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.style.visibility = "hidden", 300);
    }, 2000);
  });
});

document.getElementById("copy_address_1").addEventListener("click", function() {
  const addr = document.getElementById("wallet_address").textContent;
  navigator.clipboard.writeText(addr).then(() => {
    const toast = document.getElementById("copyToast1");
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.style.visibility = "hidden", 300);
    }, 2000);
  });
});
