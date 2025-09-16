    
    $(document).ready(function(){
    const AVALANCHE_RPC = "https://api.avax.network/ext/bc/C/rpc";

    // Example ERC20 token (USDC.e on Avalanche)
    const TOKEN_ADDRESS = "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8";

    const ERC20_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ];

    let provider, signer, token, account;

    const address = document.getElementById("address");
    const balance = document.getElementById("balance");
    const output = document.getElementById("output");

    function log(msg) {
      output.innerText += msg + "\n";
    }

    async function connect() {
      if (!window.ethereum) return alert("Install MetaMask!");

      // Ask MetaMask to connect
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      account = await signer.getAddress();

      log("Connected: " + account);
      address.innerHTML = account;

      // Load token contract
      token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

      
    }

    async function getBalance() {
      try {
        const rawBalance = await token.balanceOf(account);
        const decimals = await token.decimals();
        const symbol = await token.symbol();
        const A_Balance = ethers.utils.formatUnits(rawBalance, decimals);
        log(`Balance: ${A_Balance} ${symbol}`);
        balance.innerHTML = A_Balance;

      } catch (err) {
        console.error(err);
        log("Error: " + err.message);
      }
    }
   connect();
   getBalance();

});