$(document).ready(function(){
let walletIndex = document.getElementById("walletIndex");
let walletTrading = document.getElementById("walletTrade")
let walletICO = document.getElementById("walletICO")
let walletUser = document.getElementById("walletUser")
let walletBuy = document.getElementById("walletBuy")
let walletGateways = document.getElementById("walletGateways")
let walletAffiliate = document.getElementById("walletAffiliate")
let walletWallet = document.getElementById("walletWallet")
let walletSecurity = document.getElementById("walletSecurity")
let walletSettings = document.getElementById("walletSettings")
let walletAccount = document.getElementById("walletAccount")
let walletFaq = document.getElementById("walletFaq")
let walletSupport = document.getElementById("walletSupport")
let accountWallet = document.getElementById("accountWallet")
let walletProfile = document.getElementById("walletProfile")
let supportWallet = document.getElementById("supportWallet")
let walletTransactions = document.getElementById("supportWallet")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(walletIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(walletTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(walletICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(walletUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(walletBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(walletGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(walletAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(walletWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(walletSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(walletSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(walletAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(walletFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(walletSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(walletProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(walletTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
      dataType: "JSON",
      contentType: "application/json",
      method: "GET",
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

    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
});
