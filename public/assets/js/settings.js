$(document).ready(function(){
let settingsIndex = document.getElementById("settingsIndex");
let settingsTrading = document.getElementById("settingsTrade")
let settingsICO = document.getElementById("settingsICO")
let settingsUser = document.getElementById("settingsUser")
let settingsBuy = document.getElementById("settingsBuy")
let settingsGateways = document.getElementById("settingsGateways")
let settingsAffiliate = document.getElementById("settingsAffiliate")
let settingsWallet = document.getElementById("settingsWallet")
let settingsSecurity = document.getElementById("settingsSecurity")
let settingsSettings = document.getElementById("settingsSettings")
let settingsAccount = document.getElementById("settingsAccount")
let settingsFaq = document.getElementById("settingsFaq")
let settingsSupport = document.getElementById("settingsSupport")
let accountSettings = document.getElementById("accountSettings")
let settingsProfile = document.getElementById("settingsProfile")
let supportSettings = document.getElementById("supportSettings")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(settingsIndex).attr("href", '/api/'+ role +'/data/profile/'+ id);
$(settingsTrading).attr("href", '/api/'+ role +'/data/profile/'+ id + '/trade');
$(settingsICO).attr("href", '/api/'+ role +'/data/profile/'+ id + '/ico');
$(settingsUser).attr("href", '/api/'+ role +'/data/profile/'+ id + '/user');
$(settingsBuy).attr("href", '/api/'+ role +'/data/profile/'+ id + '/buy');
$(settingsGateways).attr("href", '/api/'+ role +'/data/profile/'+ id + '/gateways');
$(settingsAffiliate).attr("href", '/api/'+ role +'/data/profile/'+ id + '/affiliate');
$(settingsWallet).attr("href", '/api/'+ role +'/data/profile/'+ id + '/wallet');
$(settingsSecurity).attr("href", '/api/'+ role +'/data/profile/'+ id + '/security');
$(settingsSettings).attr("href", '/api/'+ role +'/data/profile/'+ id + '/settings');
$(settingsAccount).attr("href", '/api/'+ role +'/data/profile/'+ id + '/account');
$(settingsFaq).attr("href", '/api/'+ role +'/data/profile/'+ id + '/faq');
$(settingsSupport).attr("href", '/api/'+ role +'/data/profile/'+ id + '/support');
$(accountSettings).attr("href", '/api/'+ role +'/data/profile/'+ id + '/account');
$(settingsProfile).attr("href", '/api/'+ role +'/data/profile/'+ id + '/data/profile');
$(supportSettings).attr("href", '/api/'+ role +'/data/profile/'+ id + '/support');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/data/profile/${localStorage.getItem("settings_id")}/`,
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
