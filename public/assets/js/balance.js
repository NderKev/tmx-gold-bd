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
    const output = document.getElementById("output");
    const network = document.getElementById("network");
    const balanceWei = document.getElementById("wallet_balance");
    const balanceUsd = document.getElementById("wallet_usd");
    const wallet  = document.getElementById("wallet_address");
   const connectBtn = document.getElementById("connectWalletMain");
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
        wallet.innerText = account;

        const rawBalance = await token.balanceOf(account);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        const usd_balance = parseFloat(formatted * 0.005);

        balance.innerText = `${formatted} ${symbol}`;
        balanceWei.innerText = `${formatted} TMXGT`;
        balanceUsd.innerText = `${usd_balance} USD`;
      } catch (err) {
        console.error("Error loading balance:", err);
        output.innerText = "Balance: error";
      }
    }

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

     connectBtn.onclick = connect;

  const fullAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // example
  const addressEl = document.getElementById("address");
  //const addressCp = document.getElementById("copy_address");

  // Display shortened address
  function shortenAddress(addr) {
    return addr.slice(0, 6) + "…" + addr.slice(-4);
  }

  //addressEl.textContent = shortenAddress(fullAddress);

  // Copy full address on click
  /** addressEl.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      alert("Copied to clipboard: " + fullAddress);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }); **/
  document.getElementById("address").addEventListener("click", function() {
    const address = document.getElementById("address").textContent;
    navigator.clipboard.writeText(address).then(() => {
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
    const address = document.getElementById("address").textContent;
    navigator.clipboard.writeText(address).then(() => {
      const toast = document.getElementById("copyToast");
      //const toast1 = document.getElementById("copyToast1");
      toast.style.visibility = "visible";
      toast.style.opacity = "1";
      //toast1.style.visibility = "visible";
      //toast.style.opacity = "1";
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.style.visibility = "hidden", 300);
      }, 2000);
    });
    
  });


  document.getElementById("copy_address_1").addEventListener("click", function() {
    const address = document.getElementById("wallet_address").textContent;
    navigator.clipboard.writeText(address).then(() => {
      const toast = document.getElementById("copyToast1");
      toast.style.visibility = "visible";
      toast.style.opacity = "1";

      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.style.visibility = "hidden", 300);
      }, 2000);
    });
    
  });

  