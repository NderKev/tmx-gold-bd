
(function(){
  // --------------------------- Config ---------------------------
  var config = {
    projectId: "", // <-- Set your WalletConnect Project ID here
    tokenAddress: "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8",
    avalancheChainId: 43114, // Decimal chain ID
    avalancheChainHex: "0xa86a", // Hex chain ID for MetaMask
    avalancheRpc: "https://api.avax.network/ext/bc/C/rpc"
  };

  var wcClient = null;
  var wcSession = null;
  var wcProvider = null;
  var wcSigner = null;

  var mmProvider = null;
  var mmSigner = null;

  var ERC20_MIN_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ];

  function $(id){ return document.getElementById(id); }
  function safeLog(){ if(window.console) console.log.apply(console, arguments); }

  // --------------------------- Mobile detection ---------------------------
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // --------------------------- WalletConnect Signer ---------------------------
  function WalletConnectSigner(wcClient, session){
    this.wcClient = wcClient;
    this.session = session;
    this.address = session.namespaces.eip155.accounts[0].split(":")[2];
    this.chainId = session.namespaces.eip155.chains[0];
  }

  WalletConnectSigner.prototype.getAddress = async function(){ return this.address; }
  WalletConnectSigner.prototype.sendTransaction = async function(tx){
    return await this.wcClient.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method:"eth_sendTransaction", params:[tx] }
    });
  }
  WalletConnectSigner.prototype.signMessage = async function(message){
    return await this.wcClient.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method:"personal_sign", params:[message, this.address] }
    });
  }
  WalletConnectSigner.prototype.signTypedData = async function(domain, types, value){
    return await this.wcClient.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method:"eth_signTypedData", params:[this.address, {domain, types, message:value}] }
    });
  }

  // --------------------------- Switch MetaMask to Avalanche ---------------------------
  async function switchMetaMaskToAvalanche(){
    if(!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.avalancheChainHex }]
      });
      safeLog("Switched MetaMask to Avalanche");
    } catch (switchError) {
      // If the chain is not added, add it
      if (switchError.code === 4902){
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: config.avalancheChainHex,
            chainName: "Avalanche C-Chain",
            nativeCurrency: { name:"AVAX", symbol:"AVAX", decimals:18 },
            rpcUrls: [config.avalancheRpc],
            blockExplorerUrls:["https://snowtrace.io/"]
          }]
        });
        safeLog("Added Avalanche chain to MetaMask");
      } else {
        console.error("Error switching MetaMask chain:", switchError);
      }
    }
  }

  // --------------------------- Connect WalletConnect ---------------------------
  async function connectWalletConnect(){
    if(!wcClient){
      wcClient = await WalletConnectSignClient.init({
        projectId: config.projectId,
        metadata: {
          name:"TMX Gold Coin",
          description:"TMX Gold Coin DApp",
          url:"https://tmxgoldcoin.co",
          icons:["https://tmxgoldcoin.co/logo.png"]
        }
      });
    }

    var connectResult = await wcClient.connect({
      requiredNamespaces:{
        eip155:{
          methods:["eth_sendTransaction","personal_sign","eth_signTypedData"],
          chains:["eip155:1","eip155:43114","eip155:8453"],
          events:["chainChanged","accountsChanged"]
        }
      }
    });

    var uri = connectResult.uri;
    var approval = connectResult.approval;

    if(uri){
      if(isMobile()){
        window.location.href = uri; // Mobile deep link
      } else {
        var qrDiv = $("wcQR");
        if(qrDiv){ qrDiv.innerHTML=""; new QRCode(qrDiv, uri); }
      }
    }

    wcSession = await approval();

    // Force Avalanche chain
    if(!wcSession.namespaces.eip155.chains.includes("eip155:43114")){
      alert("Please switch your wallet to Avalanche C-Chain");
    }

    wcProvider = new ethers.BrowserProvider({
      request: async function({method, params}){
        var sessionChain = wcSession.namespaces.eip155.chains[0];
        return await wcClient.request({topic:wcSession.topic, chainId:sessionChain, request:{method, params}});
      }
    });

    wcSigner = new WalletConnectSigner(wcClient, wcSession);

    var addrEl = $("wcAddress");
    if(addrEl) addrEl.innerText = "Connected: "+wcSigner.address;
    safeLog("WalletConnect connected:", wcSigner.address);

    return wcSession;
  }

  // --------------------------- Connect MetaMask ---------------------------
  async function connectMetaMask(){
    if(!window.ethereum) throw new Error("MetaMask not available");
    await switchMetaMaskToAvalanche();
    mmProvider = new ethers.BrowserProvider(window.ethereum);
    await mmProvider.send("eth_requestAccounts", []);
    mmSigner = await mmProvider.getSigner();

    var addrEl = $("walletAddress");
    if(addrEl) addrEl.innerText = "Connected: "+mmSigner.address;
    safeLog("MetaMask connected:", mmSigner.address);
    return mmSigner;
  }

  // --------------------------- Helpers ---------------------------
  function getActiveProvider(){ return wcProvider || mmProvider || null; }
  function getActiveSigner(){ return mmSigner || wcSigner || null; }

  async function loadTMXBalance(provider, address){
    if(!provider) throw new Error("Provider required");
    var token = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, provider);
    var decimals = await token.decimals();
    var raw = await token.balanceOf(address);
    var formatted = ethers.formatUnits(raw, decimals);
    return {raw, formatted};
  }

  async function sendTMXToken(signerOrProvider, toAddress, amountDecimalString){
    if(!signerOrProvider) throw new Error("Signer or Provider required");
    var signer = signerOrProvider;
    if(!("sendTransaction" in signerOrProvider) || !signerOrProvider.getAddress){
      signer = signerOrProvider.getSigner ? await signerOrProvider.getSigner() : null;
    }
    if(!signer) throw new Error("Unable to resolve signer");

    var tokenAsContract = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, signer);
    var decimals = await tokenAsContract.decimals();
    var amountUnits = ethers.parseUnits(amountDecimalString.toString(), decimals);
    var tx = await tokenAsContract.transfer(toAddress, amountUnits);
    safeLog("Submitted transfer tx:", tx.hash);
    await tx.wait();
    safeLog("Transfer confirmed", tx.hash);
    return tx;
  }

  // --------------------------- Auto bind UI ---------------------------
  document.addEventListener("DOMContentLoaded", function(){
    var wcBtn = $("wcConnect");
    if(wcBtn){
      wcBtn.addEventListener("click", async function(){
        try{
          if(!config.projectId){ alert("Set your WalletConnect Project ID first!"); return; }
          await connectWalletConnect();
        }catch(err){ console.error("WC connect error:", err); alert(err.message||"WalletConnect failed"); }
      });
    }

    var mmBtn = $("connectWalletMain");
    if(mmBtn){
      mmBtn.addEventListener("click", async function(){
        try{ await connectMetaMask(); }
        catch(err){ console.error("MetaMask connect error:", err); alert(err.message||"MetaMask failed"); }
      });
    }
  });

  // --------------------------- Expose API globally ---------------------------
  window.TMXWallet = {
    connectWalletConnect,
    connectMetaMask,
    getActiveProvider,
    getActiveSigner,
    loadTMXBalance,
    sendTMXToken,
    config: config
  };
})();

