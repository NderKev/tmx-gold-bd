$(document).ready(function(){
let buyIndex = document.getElementById("buyIndex");
let buyTrading = document.getElementById("buyTrade")
let buyICO = document.getElementById("buyICO")
let buyUser = document.getElementById("buyUser")
let buyBuy = document.getElementById("buyBuy")
let buyGateways = document.getElementById("buyGateways")
let buyAffiliate = document.getElementById("buyAffiliate")
let buyWallet = document.getElementById("buyWallet")
let buySecurity = document.getElementById("buySecurity")
let buySettings = document.getElementById("buySettings")
let buyAccount = document.getElementById("buyAccount")
let buyFaq = document.getElementById("buyFaq")
let buySupport = document.getElementById("buySupport")
let accountBuy = document.getElementById("accountBuy")
let buyProfile = document.getElementById("buyProfile")
let supportBuy = document.getElementById("supportBuy")
let buyTransactions = document.getElementById("buyTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(buyIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(buyTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(buyICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(buyUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(buyBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(buyGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(buyAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(buyWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(buySecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(buySettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(buyAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(buyFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(buySupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(buyProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(buyTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
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
