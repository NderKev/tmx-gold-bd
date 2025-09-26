$(document).ready(function(){
let supportIndex = document.getElementById("supportIndex");
let supportTrading = document.getElementById("supportTrade")
let supportICO = document.getElementById("supportICO")
let supportUser = document.getElementById("supportUser")
let supportBuy = document.getElementById("supportBuy")
let supportGateways = document.getElementById("supportGateways")
let supportAffiliate = document.getElementById("supportAffiliate")
let supportWallet = document.getElementById("supportWallet")
let supportSecurity = document.getElementById("supportSecurity")
let supportSettings = document.getElementById("supportSettings")
let supportAccount = document.getElementById("supportAccount")
let supportFaq = document.getElementById("supportFaq")
let supportSupport = document.getElementById("supportSupport")
let accountSupport = document.getElementById("accountSupport")
let supportProfile = document.getElementById("supportProfile")
let headerSupport = document.getElementById("headerSupport")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(supportIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(supportTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(supportICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(supportUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(supportBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(supportGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(supportAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(supportWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(supportSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(supportSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(supportAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(supportFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(supportSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(supportProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(headerSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("support_id")}/`,
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
