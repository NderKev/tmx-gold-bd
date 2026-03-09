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
$(dashboardIndex).attr("href", '//'+ role +'/profile/'+ id);
$(dashboardUsers).attr("href", '//'+ role +'/profile/'+ id + '/users');
$(dashboardTrading).attr("href", '//'+ role +'/profile/'+ id + '/trade');
$(dashboardICO).attr("href", '//'+ role +'/profile/'+ id + '/ico');
$(dashboardUser).attr("href", '//'+ role +'/profile/'+ id + '/user');
$(dashboardBuy).attr("href", '//'+ role +'/profile/'+ id + '/buy');
$(dashboardGateways).attr("href", '//'+ role +'/profile/'+ id + '/gateways');
$(dashboardAffiliate).attr("href", '//'+ role +'/profile/'+ id + '/affiliate');
$(dashboardWallet).attr("href", '//'+ role +'/profile/'+ id + '/wallet');
$(dashboardSecurity).attr("href", '//'+ role +'/profile/'+ id + '/security');
$(dashboardSettings).attr("href", '//'+ role +'/profile/'+ id + '/settings');
$(dashboardAccount).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(dashboardFaq).attr("href", '//'+ role +'/profile/'+ id + '/faq');
$(dashboardSupport).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(accountDashboard).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(dashboardProfile).attr("href", '//'+ role +'/profile/'+ id + '/profile');
$(supportDashboard).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(dashboardTransactions).attr("href", '//'+ role +'/profile/'+ id + '/transactions');
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
  }, 1800000);


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
