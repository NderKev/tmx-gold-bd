// assets/js/wallets.js
// ES module: Unified WalletConnect v2 + MetaMask integration for TMX Gold Coin DApp

// External module imports (CDN). These work inside browser modules.
import WalletConnectSignClient from "https://esm.sh/@walletconnect/sign-client@2.10.6";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.min.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
//https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.min.js
/**
 * Exported API:
 *  - initWalletModule(options)
 *  - connectWalletConnect()
 *  - connectMetaMask()
 *  - getActiveProvider() -> returns ethers Provider (WalletConnect or MetaMask)
 *  - getActiveSigner() -> returns ethers Signer if MetaMask connected
 *  - loadTMXBalance(provider, address)
 *  - sendTMXToken(signerOrProvider, toAddress, amountDecimalString)
 *
 * The module will auto-bind to the following DOM IDs if present:
 *  - #wcConnect  (button)   -> triggers WalletConnect QR
 *  - #connectWalletMain (button) -> triggers MetaMask connect
 *  - #wcAddress (div)       -> displays WalletConnect address
 *  - #wcQR (div)            -> QR code container
 *  - #walletAddress (small) -> MetaMask address display
 *
 * NOTE: Replace projectId with your WalletConnect project id (or pass via init options)
 */

// --------------------------- Configuration & State ---------------------------
let wcClient = null;
let wcSession = null;
let wcProvider = null;

let mmProvider = null;
let mmSigner = null;

let config = {
  projectId: "", // must be set via initWalletModule()
  tokenAddress: "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8", // TMXGT default
  avalancheChainHex: "0xa86a",
  avalancheRpc: "https://api.avax.network/ext/bc/C/rpc",
  autoBindDom: true,
};

// Minimal ERC20 ABI for reading + transfer
const ERC20_MIN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// --------------------------- Helpers ---------------------------
function $(id) { return document.getElementById(id); }

function safeLog(...args) {
  if (window.console) console.log(...args);
}

// --------------------------- WalletConnect Init / Connect ---------------------------
export async function initWalletModule(opts = {}) {
  // override defaults with user options
  config = { ...config, ...opts };

  if (!config.projectId) {
    throw new Error("WalletConnect projectId required. Call initWalletModule({ projectId: '...' })");
  }

  // auto bind UI if requested and DOM is ready
  if (config.autoBindDom && document.readyState !== "loading") {
    _autoBindButtons();
  } else if (config.autoBindDom) {
    window.addEventListener("DOMContentLoaded", _autoBindButtons);
  }

  // No heavy initialization (WalletConnect initialized on demand)
  return true;
}

async function _initWalletConnectClient() {
  if (wcClient) return wcClient;

  wcClient = await WalletConnectSignClient.init({
    projectId: config.projectId,
    metadata: {
      name: "TMX Gold Coin",
      description: "TMX Gold Coin DApp",
      url: "https://tmxgoldcoin.co",
      icons: ["https://tmxgoldcoin.co/logo.png"]
    }
  });

  safeLog("WalletConnect SignClient initialized");
  return wcClient;
}

export async function connectWalletConnect() {
  await _initWalletConnectClient();

  const chains = ["eip155:1", "eip155:43114", "eip155:8453"];
  const { uri, approval } = await wcClient.connect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
        chains,
        events: ["chainChanged", "accountsChanged"]
      }
    }
  });

  if (uri) {
    const qrDiv = $("wcQR");
    if (qrDiv) {
      qrDiv.innerHTML = "";
      // QRCode from CDN expects 'new QRCode(element, text)'
      /* global QRCode */ 
      // If the QR lib uses a different global, this will still work for the included script.
      new QRCode(qrDiv, uri);
    }
  }

  wcSession = await approval();

  // Create an ethers-compatible provider that proxies requests to WalletConnect
  wcProvider = new ethers.BrowserProvider({
    request: async ({ method, params }) => {
      const sessionChain = wcSession.namespaces.eip155.chains[0]; // e.g., "eip155:43114"
      return await wcClient.request({
        topic: wcSession.topic,
        chainId: sessionChain,
        request: { method, params }
      });
    }
  });

  // Update UI if available
  try {
    const address = wcSession.namespaces.eip155.accounts[0].split(":")[2];
    const addrEl = $("wcAddress");
    if (addrEl) addrEl.innerText = `Connected: ${address}`;
  } catch (e) { /* noop */ }

  safeLog("WalletConnect session ready", wcSession);
  return wcSession;
}

// --------------------------- MetaMask Connect ---------------------------
export async function connectMetaMask() {
  if (!window.ethereum) throw new Error("MetaMask not available");
  mmProvider = new ethers.BrowserProvider(window.ethereum);
  await mmProvider.send("eth_requestAccounts", []);
  mmSigner = await mmProvider.getSigner();

  const addrEl = $("walletAddress");
  if (addrEl && mmSigner) addrEl.innerText = `Connected: ${mmSigner.address}`;

  safeLog("MetaMask connected:", mmSigner.address);
  // Optionally enforce Avalanche chain if your application requires it
  return mmSigner;
}

// --------------------------- Unified helpers ---------------------------
/**
 * Returns currently active provider:
 *  - WalletConnect provider if connected
 *  - else MetaMask provider if connected
 *  - else null
 */
export function getActiveProvider() {
  return wcProvider || mmProvider || null;
}

/**
 * Returns MetaMask signer if connected, otherwise null.
 * For WalletConnect, you typically operate via provider requests rather than a native signer object.
 */
export function getActiveSigner() {
  return mmSigner || null;
}

/**
 * Load TMXGT balance for an address using provided ethers provider.
 * provider can be any ethers Provider (BrowserProvider / JsonRpcProvider).
 */
export async function loadTMXBalance(provider, address) {
  if (!provider) throw new Error("Provider required");
  const token = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, provider);
  const decimals = await token.decimals();
  const raw = await token.balanceOf(address);
  const formatted = ethers.formatUnits(raw, decimals);
  return { raw, formatted };
}

/**
 * Send TMXGT token transfer.
 * signerOrProvider: If signer provided -> send via signer.
 * If only provider available (WalletConnect provider), this module will request a sendTransaction via provider.getSigner()
 *
 * amountDecimalString: "1.5" (human readable)
 */
export async function sendTMXToken(signerOrProvider, toAddress, amountDecimalString) {
  if (!signerOrProvider) throw new Error("Signer or Provider required");
  // If signer provided
  let signer = signerOrProvider;
  if (!("sendTransaction" in signerOrProvider) || !signerOrProvider.getAddress) {
    // might be a BrowserProvider - try to get signer from it (MetaMask or WalletConnect BrowserProvider)
    signer = signerOrProvider.getSigner ? await signerOrProvider.getSigner() : null;
  }

  if (!signer) throw new Error("Unable to resolve signer from provider");

  // fetch decimals
  const tokenAsContract = new ethers.Contract(config.tokenAddress, ERC20_MIN_ABI, signer);
  const decimals = await tokenAsContract.decimals();
  const amountUnits = ethers.parseUnits(amountDecimalString.toString(), decimals);

  // send transfer
  const tx = await tokenAsContract.transfer(toAddress, amountUnits);
  safeLog("Submitted transfer tx:", tx.hash);
  await tx.wait();
  safeLog("Transfer confirmed", tx.hash);
  return tx;
}

// --------------------------- Auto UI binding ---------------------------
function _autoBindButtons() {
  const wcBtn = $("wcConnect");
  const mmBtn = $("connectWalletMain");
  if (wcBtn) wcBtn.addEventListener("click", async (e) => {
    try {
      await initWalletModule({ projectId: config.projectId }); // ensure set
      await connectWalletConnect();
    } catch (err) {
      console.error("WC connect error:", err);
      alert(err.message || "WalletConnect failed");
    }
  });

  if (mmBtn) mmBtn.addEventListener("click", async (e) => {
    try {
      await connectMetaMask();
    } catch (err) {
      console.error("MetaMask connect error:", err);
      alert(err.message || "MetaMask connect failed");
    }
  });
}

// --------------------------- Export default convenience object ---------------------------
export default {
  init: initWalletModule,
  connectWalletConnect,
  connectMetaMask,
  getActiveProvider,
  getActiveSigner,
  loadTMXBalance,
  sendTMXToken,
};
