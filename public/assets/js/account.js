$(document).ready(function(){
let indexAccount = document.getElementById("indexAccount");
let accountTrading = document.getElementById("accountTrading")
let accountICO = document.getElementById("accountICO")
let accountUser = document.getElementById("accountUser")
let accountBuy = document.getElementById("accountBuy")
let accountGateways = document.getElementById("accountGateways")
let accountAffiliate = document.getElementById("accountAffiliate")
let accountWallet = document.getElementById("accountWallet")
let accountSecurity = document.getElementById("accountSecurity")
let accountSettings = document.getElementById("accountSettings")
let accountAccount = document.getElementById("accountAccount")
let accountFaq = document.getElementById("accountFaq")
let accountSupport = document.getElementById("accountSupport")
let settingsAccount = document.getElementById("settingsAccount")
let accountProfile = document.getElementById("accountProfile")
let supportAccount = document.getElementById("supportAccount")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(indexAccount).attr("href", '/api/'+ role +'/profile/'+ id);
$(accountTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(accountICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(accountUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(accountBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(accountGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(accountAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(accountWallet).attr("href", '/api/'+ role +'profile/'+ id + '/wallet');
$(accountSecurity).attr("href", '/api/'+ role +'profile/'+ id + '/security');
$(accountSettings).attr("href", '/api/'+ role +'profile/'+ id + '/settings');
$(accountAccount).attr("href", '/api/'+ role +'profile/'+ id + '/account');
$(accountFaq).attr("href", '/api/'+ role +'profile/'+ id + '/faq');
$(accountSupport).attr("href", '/api/'+ role +'profile/'+ id + '/support');
$(settingsAccount).attr("href", '/api/'+ role +'profile/'+ id + '/account');
$(accountProfile).attr("href", '/api/'+ role +'profile/'+ id + '/profile');
$(supportAccount).attr("href", '/api/'+ role +'profile/'+ id + '/support');
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
