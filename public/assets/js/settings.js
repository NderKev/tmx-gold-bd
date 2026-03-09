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
let settingsTransactions = document.getElementById("supportSettings")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(settingsIndex).attr("href", '//'+ role +'/profile/'+ id);
$(settingsTrading).attr("href", '//'+ role +'/profile/'+ id + '/trade');
$(settingsICO).attr("href", '//'+ role +'/profile/'+ id + '/ico');
$(settingsUser).attr("href", '//'+ role +'/profile/'+ id + '/user');
$(settingsBuy).attr("href", '//'+ role +'/profile/'+ id + '/buy');
$(settingsGateways).attr("href", '//'+ role +'/profile/'+ id + '/gateways');
$(settingsAffiliate).attr("href", '//'+ role +'/profile/'+ id + '/affiliate');
$(settingsWallet).attr("href", '//'+ role +'/profile/'+ id + '/wallet');
$(settingsSecurity).attr("href", '//'+ role +'/profile/'+ id + '/security');
$(settingsSettings).attr("href", '//'+ role +'/profile/'+ id + '/settings');
$(settingsAccount).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(settingsFaq).attr("href", '//'+ role +'/profile/'+ id + '/faq');
$(settingsSupport).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(accountSettings).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(settingsProfile).attr("href", '//'+ role +'/profile/'+ id + '/profile');
$(supportSettings).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(settingsTransactions).attr("href", '//'+ role +'/profile/'+ id + '/transactions');
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

    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
});
