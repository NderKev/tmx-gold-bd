import WalletConnectSignClient from "https://esm.sh/@walletconnect/sign-client@2.10.6";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.min.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";

let wcClient = null;
let wcSession = null;
let wcProvider = null;

let config = {
  projectId: "64fdb4c3db7b60fe08d35ff66de0af9e", // Set your WalletConnect Project ID here
  tokenAddress: "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8",
  avalancheChainHex: "0xa86a",
  avalancheRpc: "https://api.avax.network/ext/bc/C/rpc",
};

// --------------------------- WalletConnect Connect ---------------------------
export async function connectWalletConnect() {
  if (!wcClient) {
    wcClient = await WalletConnectSignClient.init({
      projectId: config.projectId,
      metadata: {
        name: "TMX Gold Coin",
        description: "TMX Gold Coin DApp",
        url: "https://tmxgoldcoin.co",
        icons: ["https://tmxgoldcoin.co/logo.png"]
      }
    });
  }

  const { uri, approval } = await wcClient.connect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
        chains: ["eip155:1","eip155:43114","eip155:8453"],
        events: ["chainChanged", "accountsChanged"]
      }
    }
  });

  if (uri) {
    const qrDiv = document.getElementById("wcQR");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, uri);
    }
  }

  wcSession = await approval();

  // WalletConnect BrowserProvider
  wcProvider = new ethers.BrowserProvider({
    request: async ({ method, params }) => {
      const sessionChain = wcSession.namespaces.eip155.chains[0];
      return await wcClient.request({
        topic: wcSession.topic,
        chainId: sessionChain,
        request: { method, params }
      });
    }
  });

  // Display connected address
  const address = wcSession.namespaces.eip155.accounts[0].split(":")[2];
  const addrEl = document.getElementById("wcAddress");
  if (addrEl) addrEl.innerText = `Connected: ${address}`;

  console.log("WalletConnect connected:", address);
  return wcSession;
}

// --------------------------- Auto bind ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const wcBtn = document.getElementById("wcConnect");
  if (wcBtn) {
    wcBtn.addEventListener("click", async () => {
      try {
        if (!config.projectId) {
          alert("Set your WalletConnect Project ID first!");
          return;
        }
        await connectWalletConnect();
      } catch (err) {
        console.error("WC connect error:", err);
        alert(err.message || "WalletConnect failed");
      }
    });
  }
});
