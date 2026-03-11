
let signClient;
let session;
let provi_der;

const projectId = "f0b82f05-754a-490f-9af6-b55fd0663c93";  // REQUIRED

// Detect if user is on mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768);
}

async function initWalletConnect() {
  signClient = await WalletConnectSignClient.init({
    projectId,
    metadata: {
      name: "TMX Gold Coin",
      description: "TMX Gold Coin DApp",
      url: "https://tmxgoldcoin.co",
      icons: ["https://tmxgoldcoin.co/logo.png"],
    }
  });

  console.log("WalletConnect initialized");
}

async function connectWallet() {
  const chains = ["eip155:1", "eip155:43114", "eip155:8453"]; // ETH / AVAX / BASE  

  // request connection
  const { uri, approval } = await signClient.connect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
        chains,
        events: ["chainChanged", "accountsChanged"]
      },
    },
  });

  // If URI exists → handle based on device type
  if (uri) {
    const qrDiv = document.getElementById("wcQR");
    qrDiv.innerHTML = "";
    
    if (isMobileDevice()) {
      // For mobile devices, use deep link to open wallet app
      await handleMobileConnection(uri);
    } else {
      // For desktop, show QR code
      new QRCode(qrDiv, uri);
    }
  }

  // Wait for approval
  session = await approval();
  provi_der = createEvmProvider(session);

  // Show connected wallet
  const address = session.namespaces.eip155.accounts[0].split(":")[2];
  document.getElementById("wcAddress").innerHTML = `Connected: ${address}`;
  document.getElementById("wcQR").innerHTML = "";
  
  console.log("Connected session:", session);
}

// Handle mobile wallet connection via deep links
async function handleMobileConnection(uri) {
  // Encode URI for deep link
  const encodedUri = encodeURIComponent(uri);
  
  // WalletConnect universal link for mobile wallets
  const universalLink = `https://app.walletconnect.com/wc?uri=${encodedUri}`;
  
  // Try to open wallet app via deep link
  // Common mobile wallet deep links
  const walletDeepLinks = [
    `metamask://wc?uri=${encodedUri}`,
    `rainbow://wc?uri=${encodedUri}`,
    `trust://wc?uri=${encodedUri}`,
    `coinbase://wc?uri=${encodedUri}`,
    `argent://wc?uri=${encodedUri}`,
    `phantom://wc?uri=${encodedUri}`,
  ];
  
  const qrDiv = document.getElementById("wcQR");
  
  // Show loading message
  qrDiv.innerHTML = `<div style="text-align:center;padding:20px;">
    <p>Opening wallet app...</p>
    <p style="font-size:12px;color:#666;">If nothing happens, please open your wallet app manually</p>
    <button onclick="window.location.href='${universalLink}'" style="margin-top:10px;padding:10px 20px;background:#f5a623;color:#fff;border:none;border-radius:5px;cursor:pointer;">
      Open Wallet
    </button>
  </div>`;
  
  // Try opening deep links (will fail gracefully if wallet not installed)
  for (const deepLink of walletDeepLinks) {
    try {
      window.location.href = deepLink;
      // If we're here, the wallet app was opened
      break;
    } catch (e) {
      console.log("Deep link failed:", deepLink);
    }
  }
  
  // Also try universal link as fallback
  setTimeout(() => {
    window.open(universalLink, '_blank');
  }, 1000);
}

// Convert WalletConnect to Ethers provider
function createEvmProvider(session) {
  return new ethers.BrowserProvider({
    request: async ({ method, params }) => {
      const result = await signClient.request({
        topic: session.topic,
        chainId: session.namespaces.eip155.chains[0],
        request: { method, params }
      });
      return result;
    }
  });
}

document.getElementById("wcConnect").onclick = async () => {
  await initWalletConnect();
  await connectWallet();
};

