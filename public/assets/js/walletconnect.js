
let signClient;
let session;
let provi_der;

const projectId = "f0b82f05-754a-490f-9af6-b55fd0663c93";  // REQUIRED

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

  // If URI exists → show QR code
  if (uri) {
    const qrDiv = document.getElementById("wcQR");
    qrDiv.innerHTML = "";
    new QRCode(qrDiv, uri);
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

