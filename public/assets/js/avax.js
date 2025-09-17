const ERC20_ABI = [
      "function transfer(address to, uint amount) returns (bool)"
    ];

    const TOKEN_ADDRESSES = {
      USDT: {
        ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        avalanche: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118", // USDT.e
        bsc: "0x55d398326f99059fF775485246999027B3197955"
      },
      USDC: {
        ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        avalanche: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", // USDC.e
        bsc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
      }
    };
    const ETH_ADDRESS = "0x39bbe9679406bbeca2ea6ac680cfcc24dec900a8";
    const BTC_ADDRESS = "13hm8o5cG63H7fM5CuioY5iwnukHZPX6VD";
    const CHAINS = {
      ethereum: {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://rpc.ankr.com/eth"],
        blockExplorerUrls: ["https://etherscan.io/"]
      },
      avalanche: {
        chainId: "0xa86a",
        chainName: "Avalanche C-Chain",
        nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io/"]
      },
      bsc: {
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com/"]
      }
    };

    // switch or add network
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

    async function getPrices() {
      const ids = [
        "ethereum",     // ETH
        "avalanche-2",  // AVAX
        "binancecoin",  // BNB
        "tether",       // USDT
        "usd-coin"      // USDC
      ];

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        return {
          ETH: data.ethereum.usd,
          AVAX: data["avalanche-2"].usd,
          BNB: data.binancecoin.usd,
          USDT: data.tether.usd,
          USDC: data["usd-coin"].usd,
          USDTe : data.tether.usd,
          USDCe : data["usd-coin"].usd
        };
      } catch (err) {
        console.error("Error fetching prices:", err);
        return null;
      }
    }

    /** Example usage
    (async () => {
      const prices = await getPrices();
      console.log("Prices:", prices);
    })(); **/

    // unified send
    async function sendToken({ token, chain, recipient, amount}) {
      if (!window.ethereum) return alert("MetaMask not found!");

      await switchChain(chain);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const prices = getPrices();
      const min_eth = 10/prices.ETH ;
      const min_btc = 10/prices.BTC;
      const min_avax = 10/prices.AVAX;
      const min_bnb = 10/prices.BNB;

      const minAmount = {
        ETH: ethers.parseEther(min_eth),
        AVAX: ethers.parseEther(min_avax),
        BNB: ethers.parseEther(min_bnb),
        ERC20: ethers.parseUnits("10", 6) // 10 USDT/USDC (6 decimals)
      };

      let parsedAmount;

      if (["ETH", "AVAX", "BNB"].includes(token)) {
        parsedAmount = ethers.parseEther(amount.toString());
        if (parsedAmount < minAmount[token]) {
          return alert(`Amount too low. Min for ${token} is ${ethers.formatEther(minAmount[token])}`);
        }
        const tx = await signer.sendTransaction({
          to: recipient,
          value: parsedAmount
        });
        alert(`${token} TX sent: ${tx.hash}`);
        await tx.wait();
        alert(`${token} confirmed!`);
      } else {
        const tokenAddress = TOKEN_ADDRESSES[token][chain];
        if (!tokenAddress) throw new Error(`${token} not supported on ${chain}`);

        parsedAmount = ethers.parseUnits(amount.toString(), 6);
        if (parsedAmount < minAmount.ERC20) {
          return alert(`Amount too low. Min for ${token} is ${ethers.formatUnits(minAmount.ERC20, 6)}`);
        }
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        const tx = await contract.transfer(recipient, parsedAmount);
        alert(`${token} TX sent: ${tx.hash}`);
        await tx.wait();
        alert(`${token} confirmed!`);
      }
    }
    

    let crypto = document.getElementById('amount');
    let usd = document.getElementById('usd').value

     async function convertUsdToCrypto({amount, crypto}) {
      
     }


    let amount = document.getElementById('amount').value;
    let option = document.getElementById('payment_method').value;
    // demo functions
    if (option === 'ETH'){
    async function sendEth() {
      await sendToken({ token: "ETH", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });
    }
    }
    else if (option === 'AVAX'){
    async function sendAvax() {
      await sendToken({ token: "AVAX", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    }
    }
     else if (option === 'BNB'){
    async function sendBnb() {
      await sendToken({ token: "BNB", chain: "bsc", recipient: ETH_ADDRESS, amount: amount });
    }
    }
    else if (option === 'USDC'){
    async function sendUsdc() {
      await sendToken({ token: "USDC", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });
    }
    }
    else if (option === 'USDT'){
    async function sendUsdc() {
      await sendToken({ token: "USDT", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });
    }
    }
    else if (option === 'AVAX USDT'){
    async function sendUsdtE() {
      await sendToken({ token: "USDTe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    }
   }

   else if (option === 'AVAX USDC'){
    async function sendUsdcE() {
      await sendToken({ token: "USDCe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    }
   }
   else 
    {
    async function sendBTC() {
      //await sendToken({ token: "USDCe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    }
   }