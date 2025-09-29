$(document).ready(function(){
let securityIndex = document.getElementById("securityIndex");
let securityTrading = document.getElementById("securityTrade")
let securityICO = document.getElementById("securityICO")
let securityUser = document.getElementById("securityUser")
let securityBuy = document.getElementById("securityBuy")
let securityGateways = document.getElementById("securityGateways")
let securityAffiliate = document.getElementById("securityAffiliate")
let securityWallet = document.getElementById("securityWallet")
let securitySecurity = document.getElementById("securitySecurity")
let securitySettings = document.getElementById("securitySettings")
let securityAccount = document.getElementById("securityAccount")
let securityFaq = document.getElementById("securityFaq")
let securitySupport = document.getElementById("securitySupport")
let accountSecurity = document.getElementById("accountSecurity")
let securityProfile = document.getElementById("securityProfile")
let supportSecurity = document.getElementById("supportSecurity")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(securityIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(securityTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(securityICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(securityUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(securityBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(securityGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(securityAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(securityWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(securitySecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(securitySettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(securityAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(securityFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(securitySupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(securityProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/data/profile');
$(supportSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
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
