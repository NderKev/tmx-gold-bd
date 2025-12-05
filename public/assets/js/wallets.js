(function () {

  /* --------------------------- Config --------------------------- */
  var config = {
    projectId: "64fdb4c3db7b60fe08d35ff66de0af9e",
    tokenAddress: "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8",
    avalancheChainId: 43114,
    avalancheChainHex: "0xa86a",
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

  /* -------------------- MetaMask Chain Switch -------------------- */
  async function switchMetaMaskToAvalanche() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.avalancheChainHex }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: config.avalancheChainHex,
            chainName: "Avalanche C-Chain",
            nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
            rpcUrls: [config.avalancheRpc],
            blockExplorerUrls: ["https://snowtrace.io/"]
          }]
        });
      } else {
        console.error(err);
      }
    }
  }

  /* --------------------------- Connect WalletConnect --------------------------- */
  async function connectWalletConnect() {

    // FIXED: this is the correct class exposed by the WC browser bundle
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
          chains: ["eip155:43114"],
          events: ["chainChanged", "accountsChanged"]
        }
      }
    });

    var uri = connectResult.uri;
    var approval = connectResult.approval;

    // Show QR (desktop) or redirect (mobile)
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

    // Provider wrapper
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

    // Update UI
    updateAddressDisplays(wcSigner.address);

    safeLog("WC connected:", wcSigner.address);
    return wcSession;
  }

  /* --------------------------- Connect MetaMask --------------------------- */
  async function connectMetaMask() {
    if (!window.ethereum) throw new Error("MetaMask not available");

    await switchMetaMaskToAvalanche();

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

    // WC Button
    var wcBtn = $("wcConnect");
    if (wcBtn) {
      wcBtn.onclick = async function () {
        try { await connectWalletConnect(); }
        catch (err) { alert(err.message || "WalletConnect failed"); }
      };
    }

    // MetaMask Button
    var mmBtn = $("connectWalletMain");
    if (mmBtn) {
      mmBtn.onclick = async function () {
        try { await connectMetaMask(); }
        catch (err) { alert(err.message || "MetaMask failed"); }
      };
    }
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
