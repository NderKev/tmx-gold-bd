$(document).ready(function(){
let affiliateIndex = document.getElementById("affiliateIndex");
let affiliateTrading = document.getElementById("affiliateTrading")
let affiliateICO = document.getElementById("affiliateICO")
let affiliateUser = document.getElementById("affiliateUser")
let affiliateBuy = document.getElementById("affiliateBuy")
let affiliateGateways = document.getElementById("affiliateGateways")
let affiliateAffiliate = document.getElementById("affiliateAffiliate")
let affiliateWallet = document.getElementById("affiliateWallet")
let affiliateSecurity = document.getElementById("affiliateSecurity")
let affiliateSettings = document.getElementById("affiliateSettings")
let affiliateAccount = document.getElementById("affiliateAccount")
let affiliateFaq = document.getElementById("affiliateFaq")
let affiliateSupport = document.getElementById("affiliateSupport")
let accountAffiliate = document.getElementById("accountAffiliate")
let affiliateProfile = document.getElementById("affiliateProfile")
let supportAffiliate = document.getElementById("supportAffiliate")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(affiliateIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(affiliateTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(affiliateICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(affiliateUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(affiliateBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(affiliateGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(affiliateAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(affiliateWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(affiliateSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(affiliateSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(affiliateAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(affiliateFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(affiliateSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(affiliateProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}/`,
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
