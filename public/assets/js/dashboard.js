$(document).ready(function(){
let dashboardIndex = document.getElementById("dashboardIndex");
let dashboardUsers = document.getElementById("dashboardUsers");
let dashboardTrading = document.getElementById("dashboardTrade")
let dashboardICO = document.getElementById("dashboardICO")
let dashboardUser = document.getElementById("dashboardUser")
let dashboardBuy = document.getElementById("dashboardBuy")
let dashboardGateways = document.getElementById("dashboardGateways")
let dashboardAffiliate = document.getElementById("dashboardAffiliate")
let dashboardWallet = document.getElementById("dashboardWallet")
let dashboardSecurity = document.getElementById("dashboardSecurity")
let dashboardSettings = document.getElementById("dashboardSettings")
let dashboardAccount = document.getElementById("dashboardAccount")
let dashboardFaq = document.getElementById("dashboardFaq")
let dashboardSupport = document.getElementById("dashboardSupport")
let accountDashboard = document.getElementById("accountDashboard")
let dashboardProfile = document.getElementById("dashboardProfile")
let supportDashboard = document.getElementById("supportDashboard")
let dashboardTransactions = document.getElementById("dashboardTransactions")


var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(dashboardIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(dashboardUsers).attr("href", '/api/'+ role +'/profile/'+ id + '/users');
$(dashboardTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(dashboardICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(dashboardUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(dashboardBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(dashboardGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(dashboardAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(dashboardWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(dashboardSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(dashboardSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(dashboardAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(dashboardFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(dashboardSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountDashboard).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(dashboardProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportDashboard).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(dashboardTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
      dataType: "JSON",
      contentType: "application/json",
      method: "GET",
      xhrFields: { withCredentials: true },
      error: (err) => {
        if (err.status === 401){
        alert("Session Expired! Kindly login again");
        localStorage.setItem('tmx_gold_name', "");
        localStorage.setItem('role', "");
        localStorage.setItem('token', "");
        window.location.href = "/index.html";
      }
      },
      success: function(results){

      }
    });
  }, 30000);


document.addEventListener('DOMContentLoaded', function () {
  const role = localStorage.getItem('role');   // e.g. "admin" or "customer"

  if (role === 'customer') {
    // Option 1: completely remove the element
    document.getElementById('icoMenu').remove();
    document.getElementById('paymentMenu').remove();
    document.getElementById('usersMenu').remove();
    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
});



$("#buyTokensButton").click(async (e)  => {
  e.preventDefault();
  const ethBalanceElement = document.getElementById("eth_balance_number");  
  const ethBalance = parseFloat(ethBalanceElement.value);
  let tokenAmount = document.getElementById("tmxgtAmount").value;
  const address = document.getElementById("tmxgtAddress").value;
  tokenAmount = Math.pow(tokenAmount, 18);
  const expectedEthWei = tokenAmount * 2616150800000; // Assuming 1 TMXGT = 0.01 ETH
  const email = localStorage.getItem("tmx_gold_name");
  if (!ethBalance || ethBalance <= 0) {
    alert("Your ETH balance is too low to make a purchase. Please deposit more ETH and try again.");
    return;
  }
  if (!tokenAmount || tokenAmount <= 0) {
    alert("Please enter a valid token amount greater than 0");
    return;
  }

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    alert("Please enter a valid Ethereum address");
    return;
  }

  try {
    const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
      ? "http://localhost:7000"
      : 'https://tmxgoldcoin.co';

    const response = await fetch(`${AUTH_BACKEND_URL}/api/payments/buyTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tokenAmount, expectedEthWei, email, address}),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Purchase successful! Transaction Hash: " + data.txHash);
    } else {
      alert("Purchase failed: " + (data.error || "Unknown error"));
    }
  } catch (error) {
    alert("An error occurred: " + (error?.message || String(error)));
  }
});