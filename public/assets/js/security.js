$(document).ready(function() {
    // --- UI Element Selectors ---
    const securityElements = {
        index: document.getElementById("securityIndex"),
        trade: document.getElementById("securityTrade"),
        ico: document.getElementById("securityICO"),
        user: document.getElementById("securityUser"),
        buy: document.getElementById("securityBuy"),
        gateways: document.getElementById("securityGateways"),
        affiliate: document.getElementById("securityAffiliate"),
        wallet: document.getElementById("securityWallet"),
        security: document.getElementById("securitySecurity"),
        settings: document.getElementById("securitySettings"),
        account: document.getElementById("securityAccount"),
        faq: document.getElementById("securityFaq"),
        support: document.getElementById("securitySupport"),
        accSec: document.getElementById("accountSecurity"),
        profile: document.getElementById("securityProfile"),
        suppSec: document.getElementById("supportSecurity"),
        trans: document.getElementById("securityTransactions"),
        buy1: document.getElementById("BuyandSell1"),
        buy2: document.getElementById("BuyandSell2")
    };

    const role = localStorage.getItem("role");
    const id = localStorage.getItem("user_id");
    const isLoggedIn = localStorage.getItem("tmx_gold_name");

    // --- Authentication Check ---
    if (!isLoggedIn) {
        window.location.href = "/index.html";
    } else {
        const basePath = `/api/${role}/profile/${id}`;
        
        // Map UI elements to their respective paths
        const routes = {
            index: '', trade: '/trade', ico: '/ico', user: '/user', buy: '/buy',
            gateways: '/gateways', affiliate: '/affiliate', wallet: '/wallet',
            security: '/security', settings: '/settings', account: '/account',
            faq: '/faq', support: '/support', accSec: '/account', profile: '/profile',
            suppSec: '/support', trans: '/transactions', buy1: '/buy', buy2: '/buy'
        };

        for (let key in routes) {
            if (securityElements[key]) {
                $(securityElements[key]).attr("href", basePath + routes[key]);
            }
        }
    }
});

// --- Session Expiry Watchdog (30 mins) ---
setInterval(function() {
    const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("user_id");

    if (role && id) {
        $.ajax({
            url: `${AUTH_BACKEND_URL}/api/${role}/profile/${id}`,
            method: "GET",
            error: (err) => {
                if (err.status === 401) {
                    alert("Session Expired! Kindly login again");
                    localStorage.clear(); // Clear all for safety
                    window.location.href = "/index.html";
                }
            }
        });
    }
}, 1800000);

// --- Role-Based UI Cleanup ---
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');
    if (role === 'customer') {
        const icoMenu = document.getElementById('icoMenu');
        const paymentMenu = document.getElementById('paymentMenu');
        if (icoMenu) icoMenu.remove();
        if (paymentMenu) paymentMenu.remove();
    }
    // Auto-connect wallet on load
    connect();
});

// --- BASE MAINNET CONFIGURATION ---
const BASE_RPC = "https://mainnet.base.org";
const BASE_CHAIN_ID = "0x2105"; // 8453 Decimal
const TOKEN_ADDRESS = "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8"; // Ensure this is the BASE address

const ERC20_ABI_TMXGT = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address recipient, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

const addressDisplay = document.getElementById("address");
const balanceDisplay = document.getElementById("balance");
const usdDisplay = document.getElementById("usd_balance");
const networkDisplay = document.getElementById("network");

let provider, signer, token, decimals;

// --- Web3 Functions ---

async function switchToBase() {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BASE_CHAIN_ID }]
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: BASE_CHAIN_ID,
                        chainName: "Base Mainnet",
                        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                        rpcUrls: [BASE_RPC],
                        blockExplorerUrls: ["https://basescan.org/"]
                    }]
                });
            } catch (addError) {
                console.error("User rejected adding the network.");
            }
        }
    }
}

async function checkNetwork() {
    const network = await provider.getNetwork();
    const hexId = "0x" + network.chainId.toString(16);
    
    if (hexId !== BASE_CHAIN_ID) {
        alert("Wrong network! Switching to Base Mainnet.");
        await switchToBase();
        return false;
    }
    if (networkDisplay) networkDisplay.innerText = `Base Mainnet (8453)`;
    return true;
}

async function loadBalance() {
    try {
        const userAddress = await signer.getAddress();
        if (addressDisplay) addressDisplay.innerText = userAddress;

        const rawBalance = await token.balanceOf(userAddress);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        
        // Assuming price per token is 0.005 USD
        const usdValue = (parseFloat(formatted) * 0.005).toFixed(2);

        if (balanceDisplay) balanceDisplay.innerText = `${formatted} TMXGT`;
        if (usdDisplay) usdDisplay.innerText = `${usdValue} USD`;
    } catch (err) {
        console.error("Error loading blockchain data:", err);
    }
}

async function connect() {
    if (!window.ethereum) return console.log("MetaMask not found");

    provider = new ethers.BrowserProvider(window.ethereum);
    
    try {
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();

        if (!(await checkNetwork())) return;

        token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI_TMXGT, signer);
        decimals = await token.decimals();

        await loadBalance();

        // Listeners
        window.ethereum.on("accountsChanged", () => location.reload());
        window.ethereum.on("chainChanged", () => location.reload());

    } catch (err) {
        console.error("Connection failed", err);
    }
}

// Helper: Shorten Address
function getShortAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}