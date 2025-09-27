$(document).ready(function(){
let userIndex = document.getElementById("userIndex");
let userTrading = document.getElementById("userTrade")
let userICO = document.getElementById("userICO")
let userUser = document.getElementById("userUser")
let userBuy = document.getElementById("userBuy")
let userGateways = document.getElementById("userGateways")
let userAffiliate = document.getElementById("userAffiliate")
let userWallet = document.getElementById("userWallet")
let userSecurity = document.getElementById("userSecurity")
let userSettings = document.getElementById("userSettings")
let userAccount = document.getElementById("userAccount")
let userFaq = document.getElementById("userFaq")
let userSupport = document.getElementById("userSupport")
let accountUser = document.getElementById("accountUser")
let userProfile = document.getElementById("userProfile")
let supportUser = document.getElementById("supportUser")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(userIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(userTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(userICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(userUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(userBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(userGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(userAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(userWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(userSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(userSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(userAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(userFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(userSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountUser).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(userProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/data/profile');
$(supportUser).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/data/profile/${localStorage.getItem("user_id")}/`,
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
