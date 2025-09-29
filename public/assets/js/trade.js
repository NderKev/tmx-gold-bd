$(document).ready(function(){
let tradeIndex = document.getElementById("tradeIndex");
let tradeTrading = document.getElementById("tradeTrade")
let tradeICO = document.getElementById("tradeICO")
let tradeUser = document.getElementById("tradeUser")
let tradeBuy = document.getElementById("tradeBuy")
let tradeGateways = document.getElementById("tradeGateways")
let tradeAffiliate = document.getElementById("tradeAffiliate")
let tradeWallet = document.getElementById("tradeWallet")
let tradeSecurity = document.getElementById("tradeSecurity")
let tradeSettings = document.getElementById("tradeSettings")
let tradeAccount = document.getElementById("tradeAccount")
let tradeFaq = document.getElementById("tradeFaq")
let tradeSupport = document.getElementById("tradeSupport")
let accountTrade = document.getElementById("accountTrade")
let tradeProfile = document.getElementById("tradeProfile")
let supportTrade = document.getElementById("supportTrade")
let tradeTransactions = document.getElementById("tradeTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(tradeIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(tradeTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(tradeICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(tradeUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(tradeBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(tradeGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(tradeAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(tradeWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(tradeSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(tradeSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(tradeAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(tradeFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(tradeSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountTrade).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(tradeProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportTrade).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(tradeTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
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
