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
        "bitcoin",  
        "ethereum",     // ETH
        "avalanche-2",  // AVAX
        "binancecoin",  // BNB
        "tether",       // USDT
        "usd-coin",     // USDC
        "celo-kenyan-shilling"
      ];

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        /** async function getUsdToKes() {
        const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KES');
        const data = await res.json();
        console.log(data);
        console.log(`1 USD = ${data.rates.KES} KES`);
        const rate = data.rates.KES;
        return rate;
      } **/

        //let kes_usd = getUsdToKes();

        return {
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          AVAX: data["avalanche-2"].usd,
          BNB: data.binancecoin.usd,
          USDT: data.tether.usd,
          USDC: data["usd-coin"].usd,
          USDTe : data.tether.usd,
          USDCe : data["usd-coin"].usd,
          Mpesa : data["celo-kenyan-shilling"].usd,
          Paystack : data["celo-kenyan-shilling"].kes
        };
      } catch (err) {
        console.error("Error fetching prices:", err);
        return null;
      }
    }

const url = "https://api.coingecko.com/api/v3/simple/price?ids=celo-kenyan-shilling&vs_currencies=usd,kes";

async function getCKESPrice() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // Extract prices
    const ckesUsd = data["celo-kenyan-shilling"].usd;
    const ckesKes = data["celo-kenyan-shilling"].kes;

    console.log(`CKES Price in USD: $${ckesUsd}`);
    console.log(`CKES Price in KES: KSh ${ckesKes}`);
    return { usd: ckesUsd, kes: ckesKes };
  } catch (error) {
    console.error("Error fetching CKES price:", error);
  }
}

// Call the function
//getCKESPrice();

    /** Example usage
    (async () => {
      const prices = await getPrices();
      console.log("Prices:", prices);
    })(); **/

    // unified send
    let prices, kes_prices;
   
    (async () => {
       prices = await getPrices();
      console.log("Prices:", prices);
       kes_prices = await getCKESPrice();
       console.log("Prices:", kes_prices);
    })();

    async function sendToken({ token, chain, recipient, amount}) {
      if (!window.ethereum) return alert("MetaMask not found!");

      await switchChain(chain);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      //prices = await getPrices();
      
      const min_eth = (10/prices.ETH).toFixed(4);
      const min_btc = (10/prices.BTC).toFixed(8);
      const min_avax = (10/prices.AVAX).toFixed(4);
      const min_bnb = (10/prices.BNB).toFixed(4);
      const min_kes = (10/kes_prices.usd).toFixed(0);


      const minAmount = {
        ETH: min_eth,//ethers.parseEther(min_eth.toString()),
        AVAX: min_avax, //ethers.parseEther(min_avax.toString()),
        BNB: min_bnb, //ethers.parseEther(min_bnb.toString()),
        ERC20: ethers.parseUnits("10", 6) // 10 USDT/USDC (6 decimals)
      };

      let parsedAmount;

      if (["ETH", "AVAX", "BNB"].includes(token)) {
        parsedAmount = ethers.parseEther(amount.toString());
        //parsedAmount = parsedAmount.toFixed(4);
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
    let input = document.getElementById("usd");
    
    let _amount = document.getElementById('amount').value

  const usdInput = document.getElementById("usd");
  const tokenSelect = document.getElementById("payment_method");
  const cryptoOutput = document.getElementById("amount");
  const cryptoTo = document.getElementById("to_crypto");
  const kes_amount = document.getElementById("paystackAmount");
  const mpesa_amount = document.getElementById("mpesa_amount");
  const wallet  = document.getElementById("wallet_address");
  const user_name  = localStorage.getItem("tmx_gold_name");
  const usd = document.getElementById('usd').value;

  async function convertUsdToCrypto() {
     /* prices = {
    ETH: 2600,
    AVAX: 30,
    BNB: 320,
    USDC: 1,
    USDT: 1,
    USDTe: 1,
    USDCe: 1,
    BTC: 64000,
    Mpesa: 100,
    Paystack : 100
  }; **/
    prices = await getPrices();
    const usd = parseFloat(usdInput.value);   // ✅ convert string to number
    const option = tokenSelect.value;         // ✅ get selected token
  
    if (isNaN(usd)) {
      cryptoOutput.value = "Invalid USD";
      return;
    }
     
    let result, result_kes;

    
    if (prices[option]) {
      result = usd / parseFloat(prices[option]);
      result_kes = usd / parseFloat(prices[option]);
      
    } else {
      result = usd / parseFloat(prices.BTC);
      result_kes = usd / parseFloat(prices.Paystack);
    }
    //result = parseFloat(result);
    result = result.toFixed(5);

    cryptoOutput.value = result.toString();
    
    if (option === "Mpesa"){
      cryptoTo.innerText = "KES";
      result_kes = result_kes.toFixed(0);
      mpesa_amount.value = result_kes.toString();
    }
    else if (option === "Paystack") {
      cryptoTo.innerText = "USD";
      //result_kes = result_kes.toFixed(0);
      cryptoOutput.value = usd;
      kes_amount.value = usd;
    }
    else if (option === "Bank_Transfer") {
      cryptoTo.innerText = "USD";
      //result_kes = result_kes.toFixed(0);
      cryptoOutput.value = usd;
      //kes_amount.value = usd;
      //relayButton.enabled = false;
    }
    else if (option === "Wire_Transfer") {
      cryptoTo.innerText = "USD";
      //result_kes = result_kes.toFixed(0);
      cryptoOutput.value = usd;
      //kes_amount.value = usd;
      //relayButton.enabled = false;
    }
    else {
      cryptoTo.innerText = option.toString();
    }
    
  }
  

  

  // Run when USD changes or token changes
  usdInput.onchange = convertUsdToCrypto;
  tokenSelect.onchange = convertUsdToCrypto;

  // Initial run
   convertUsdToCrypto();
    
    //input.onchange = () => convertUsdToCrypto(input.value);

    let sendButton =  document.getElementById('btnBuyTokens');
    

    // demo functions
    
    async function sendSelectedToken(){
    let amount = document.getElementById('amount').value;//document.getElementById("amount").value.trim();
    console.log("amount :" + amount);
   
    let option = document.getElementById('payment_method').value;
    if (option === 'ETH'){
      await sendToken({ token: "ETH", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });

    
    }
    else if (option === 'AVAX'){
      await sendToken({ token: "AVAX", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
  
    }
     else if (option === 'BNB'){
    
      await sendToken({ token: "BNB", chain: "bsc", recipient: ETH_ADDRESS, amount: amount });
    
    }
    else if (option === 'USDC'){
    
      await sendToken({ token: "USDC", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });
    
    }
    else if (option === 'USDT'){
   
      await sendToken({ token: "USDT", chain: "ethereum", recipient: ETH_ADDRESS, amount: amount });
    
    }
    else if (option === 'USDTe'){
    
      await sendToken({ token: "USDTe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    
   }

   else if (option === 'USDCe'){
  
      await sendToken({ token: "USDCe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    
   }

   else if (option === 'Mpesa'){
    const paymentMethod = document.getElementById("payment_method").value;
      if (paymentMethod !== "Mpesa") {
        return;
      }
        var iti = window.intlTelInputGlobals.getInstance(
          document.querySelector("#phone")
         );
       let mpesa_number = iti.getNumber();
       mpesa_number = mpesa_number.replace("+", 0);
       let amount = document.getElementById("mpesa_amount").value;
      //let mpesa_number = document.getElementById("mpesa_number").value;
      
      let kes = parseFloat(10/kes_prices.usd);
      const minAmountKes = (kes).toFixed(0);
      if ( !amount) {
        alert("Please enter  the amount in kenya shillings.");
        return;
      }

      if (!amount || amount < minAmountKes) {
        alert("amount must be greater than" + minAmountKes + "Kenyan Shilling");
        return;
      }

      let token = parseFloat(amount * kes_prices.usd/0.005);


      var handler = PaystackPop.setup({
        key: 'pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2', // replace with the TMX public key
        email: "tony@tmxglobal.com",
        amount: amount * 100,
        currency: "KES",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        channels: ['mobile_money'],              // ✅ Enable mobile money (includes M-Pesa)
        metadata: {
          custom_fields: [
            { display_name: "Phone Number", variable_name: "phone", value: mpesa_number }
          ]
        },
        callback: function (response) {
          fetch("/payments/verify-mpesa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference, email: user_name, address: wallet.value, amount : amount, token : token, usd: usdAmount })
          })
            .then(res => res.json())
            .then(data => {
              if (data.status === "success") {
                alert("Payment successful! Crypto will be sent to your wallet.");
              } else {
                alert("Payment verification failed.");
              }
            })
            .catch(err => {
              console.error("Verification error:", err);
              alert("Error verifying payment.");
            });
        },
        onClose: function () {
          alert("Transaction was not completed, window closed.");
        }
      });

      handler.openIframe();
    
   }
   else if (option === 'Paystack'){
    const paymentMethod = document.getElementById("payment_method").value;
      if (paymentMethod !== "Paystack") {
        return;
      }
     let email = document.getElementById("paystackEmail").value;
      let amount = document.getElementById("paystackAmount").value;


      if (!email || !amount) {
        alert("Please enter both email and amount.");
        return;
      }

      if (!amount || amount < 10) {
        alert("amount must be greater than" + 10 + "USD");
        return;
      }
      let token = parseFloat(amount/0.005);

      var handler = PaystackPop.setup({
        key: 'pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2', // replace with the TMX public key
        email: email,
        amount: amount * 100,
        currency: "USD",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function (response) {
          fetch("/payments/paystack", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference, email: user_name, address: wallet.value, amount : amount, token : token, usd: usdAmount })
          })
            .then(res => res.json())
            .then(data => {
              if (data.status === "success") {
                alert("Payment successful! Crypto will be sent to your wallet.");
              } else {
                alert("Payment verification failed.");
              }
            })
            .catch(err => {
              console.error("Verification error:", err);
              alert("Error verifying payment.");
            });
        },
        onClose: function () {
          alert("Transaction was not completed, window closed.");
        }
      });
      handler.openIframe();
   }

   else 
    {
    const selected = document.getElementById("payment_method").value;
    const usdAmount = document.getElementById("usd").value;
    const btcAmount = document.getElementById("amount").value;

    if (selected === "BTC") {
      if (!usdAmount || usdAmount <= 0) {
        alert("Please enter a valid USD amount.");
        return;
      }

      const width = 500;
      const height = 600;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);

      // Pass USD + BTC to checkout.html
      window.open(
        `btc.html?usd=${usdAmount}&btc=${btcAmount}`,
        "btcCheckout",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );
    } 
    else  {
      alert(`You selected: ${selected}. Checkout for this method is not yet implemented.`);
    }
      //await sendToken({ token: "USDCe", chain: "avalanche", recipient: ETH_ADDRESS, amount: amount });
    }
  const _cypto = tokenSelect.value.toLowerCase();


  const polling = setInterval(() => checkPayment(_cypto, user_name, _amount, ETH_ADDRESS), 30000);
  checkPayment(_cypto, user_name, _amount, ETH_ADDRESS);
   
  }


  /* ------------------------------
            Paystack

-------------------------------*/
// Show Paystack fields when Paystack is selected
document.getElementById("payment_method").addEventListener("change", function () {
  const selected = this.value;
  const relayButton =  document.getElementById('btnBuyTokens');

  if (selected === "Wire_Transfer" || selected === "Bank_Transfer") {
    relayButton.disabled = true;
  } else {
    relayButton.disabled = false;
  }
});


document.getElementById("payment_method").addEventListener("change", function () {
  const selected = this.value;
  const paystackFields = document.getElementById("paystackFields");

  if (selected === "Paystack") {
    paystackFields.style.display = "block";
  } else {
    paystackFields.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", function () {
        const dropdown = document.getElementById("payment_method");
        const fields = document.querySelectorAll(".method-fields");

        function updateFields() {
            const selected = dropdown.value;
            fields.forEach(field => {
            field.style.display = (field.dataset.method === selected) ? "block" : "none";
            });
        }

        dropdown.addEventListener("change", updateFields);

        // Show default on load
        updateFields();
        connect();
          var _input = document.querySelector("#phone");
        window.intlTelInput(_input, {
          initialCountry: "ke",
          // geoIpLookup: function (callback) {
          //   $.get(
          //     "https://ipinfo.io?token=<YOUR_TOKEN>",
          //     function () {},
          //     "jsonp"
          //   ).always(function (resp) {
          //     var countryCode = resp && resp.country ? resp.country : "us";
          //     callback(countryCode);
          //   });
          // },
          utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js", // for formatting
        });
        });


  async function connect() {
      if (!window.ethereum) return alert("Install MetaMask!");
       
      //provider = new ethers.providers.Web3Provider(window.ethereum);
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      console.log("Signer address:", signer.address);
      const account = signer.address;
      wallet.value = account;
  }

sendButton.onclick = sendSelectedToken;


  async function checkPayment(crypto, email, from , amount) {
    try {
      const res = await fetch(`/payments/${crypto}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email,  amount : amount, from : from})
          })
      const data = await res.json();
      const _status = data.status;
      const _data = data.data;
      if (_data && _status == 201 ) {
        document.getElementById("status").textContent = "✅ Payment Confirmed!";
        document.getElementById("status").className = "confirmed";
        clearInterval(polling);
      } else {
        document.getElementById("status").textContent = "⚡ Payment detected, waiting for confirmations...";
        document.getElementById("status").className = "pending";
      }
    } catch (err) {
      console.error("Error checking payment:", err);
    }
  }




      