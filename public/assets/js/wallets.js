(function () {

  /* --------------------------- Config --------------------------- */
  var config = {
    projectId: "64fdb4c3db7b60fe08d35ff66de0af9e",
    tokenAddress: "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8",

    /* ---- Updated for BASE ---- */
    baseChainId: 8453,
    baseChainHex: "0x2105",
    baseRpc: "https://mainnet.base.org"
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

  function $(id) { return document.getElementById(id); }
  function safeLog() { if (console) console.log.apply(console, arguments); }

  /* --------------------------- Detect Mobile --------------------------- */
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /* ---------------- WalletConnect Custom Signer Wrapper ---------------- */
  function WalletConnectSigner(wcClient, session) {
    this.client = wcClient;
    this.session = session;
    this.address = session.namespaces.eip155.accounts[0].split(":")[2];
    this.chainId = session.namespaces.eip155.chains[0];
  }

  WalletConnectSigner.prototype.getAddress = async function () {
    return this.address;
  };

  WalletConnectSigner.prototype.sendTransaction = async function (tx) {
    return await this.client.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method: "eth_sendTransaction", params: [tx] }
    });
  };

  WalletConnectSigner.prototype.signMessage = async function (message) {
    return await this.client.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method: "personal_sign", params: [message, this.address] }
    });
  };

  WalletConnectSigner.prototype.signTypedData = async function (domain, types, value) {
    return await this.client.request({
      topic: this.session.topic,
      chainId: this.chainId,
      request: { method: "eth_signTypedData", params: [this.address, { domain, types, message: value }] }
    });
  };

  /* -------------------- MetaMask Chain Switch (BASE) -------------------- */
  async function switchMetaMaskToBase() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.baseChainHex }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: config.baseChainHex,
            chainName: "Base Mainnet",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: [config.baseRpc],
            blockExplorerUrls: ["https://basescan.org/"]
          }]
        });
      } else {
        console.error(err);
      }
    }
  }

  /* --------------------------- Connect WalletConnect (BASE) --------------------------- */
  async function connectWalletConnect() {

    if (!wcClient) {
      wcClient = await window.WalletConnectSign.init({
        projectId: config.projectId,
        metadata: {
          name: "TMX Gold Coin",
          description: "TMX Gold Coin DApp",
          url: "https://tmxgoldcoin.co",
          icons: ["https://tmxgoldcoin.co/logo.png"]
        }
      });
    }

    var connectResult = await wcClient.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
          chains: ["eip155:8453"],   // BASE
          events: ["chainChanged", "accountsChanged"]
        }
      }
    });

    var uri = connectResult.uri;
    var approval = connectResult.approval;

    if (uri) {
      if (isMobile()) {
        window.location = uri;
      } else {
        var qrDiv = $("wcQR");
        if (qrDiv) {
          qrDiv.innerHTML = "";
          new QRCode(qrDiv, uri);
        }
      }
    }

    wcSession = await approval();

    wcProvider = new ethers.BrowserProvider({
      request: async function ({ method, params }) {
        return await wcClient.request({
          topic: wcSession.topic,
          chainId: wcSession.namespaces.eip155.chains[0],
          request: { method, params }
        });
      }
    });

    wcSigner = new WalletConnectSigner(wcClient, wcSession);

    updateAddressDisplays(wcSigner.address);

    safeLog("WC connected:", wcSigner.address);
    return wcSession;
  }

  /* --------------------------- Connect MetaMask (BASE) --------------------------- */
  async function connectMetaMask() {
    if (!window.ethereum) throw new Error("MetaMask not available");

    // Switch to BASE
    await switchMetaMaskToBase();

    mmProvider = new ethers.BrowserProvider(window.ethereum);
    await mmProvider.send("eth_requestAccounts", []);

    mmSigner = await mmProvider.getSigner();
    updateAddressDisplays(mmSigner.address);

    safeLog("MetaMask connected:", mmSigner.address);
    return mmSigner;
  }

  /* --------------------------- Address Display Helper --------------------------- */
  function updateAddressDisplays(address) {
    if ($("wcAddress")) $("wcAddress").innerText = address;
    if ($("walletAddress")) $("walletAddress").innerText = address;
    if ($("address")) $("address").innerText = address.substring(0, 6) + "..." + address.slice(-4);
  }

  /* --------------------------- Public Helpers --------------------------- */
  function getActiveProvider() { return wcProvider || mmProvider; }
  function getActiveSigner() { return mmSigner || wcSigner; }

  async function loadTMXBalance(provider, address) {
    var token = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, provider);
    var decimals = await token.decimals();
    var raw = await token.balanceOf(address);
    return { raw, formatted: ethers.formatUnits(raw, decimals) };
  }

  async function sendTMXToken(signerOrProvider, to, amount) {
    var signer = signerOrProvider.getAddress ? signerOrProvider : await signerOrProvider.getSigner();
    var token = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, signer);
    var decimals = await token.decimals();
    var units = ethers.parseUnits(amount.toString(), decimals);

    var tx = await token.transfer(to, units);
    await tx.wait();
    return tx;
  }

  /* --------------------------- Bind UI Clicks --------------------------- */
  document.addEventListener("DOMContentLoaded", function () {

    var wcBtn = $("wcConnect");
    if (wcBtn) {
      wcBtn.onclick = async function () {
        try { await connectWalletConnect(); }
        catch (err) { alert(err.message || "WalletConnect failed"); }
      };
    }

    // MetaMask button is optional depending on your UI
  });

  /* --------------------------- Expose API --------------------------- */
  window.TMXWallet = {
    connectWalletConnect,
    connectMetaMask,
    getActiveProvider,
    getActiveSigner,
    loadTMXBalance,
    sendTMXToken,
    config
  };

})();
