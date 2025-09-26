$(document).ready(function(){
let dashboardIndex = document.getElementById("dashboardIndex");
let dashboardTrading = document.getElementById("dashboardTrading")
let dashboardICO = document.getElementById("dashboardICO")
let dashboardUser = document.getElementById("dashboardUser")
let dashboardBuy = document.getElementById("dashboardBuy")
let dashboardGateways = document.getElementById("dashboardGateways")
let dashboardAffiliate = document.getElementById("dashboardAffiliate")
let dashboardWallet = document.getElementById("dashboardWallet")
let dashboardSecurity = document.getElementById("dashboardSecurity")
let dashboardSettings = document.getElementById("dashboardSettings")
let dashboardAccount = document.getElementById("dashboardAccount")
let dashboardFaq = document.getElementById("dashboardFaq")
let dashboardSupport = document.getElementById("dashboardSupport")
let accountDashboard = document.getElementById("accountDashboard")
let dashboardProfile = document.getElementById("dashboardProfile")
let supportDashboard = document.getElementById("supportDashboard")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(dashboardIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(dashboardTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(dashboardICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(dashboardUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(dashboardBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(dashboardGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(dashboardAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(dashboardWallet).attr("href", '/api/'+ role +'profile/'+ id + '/wallet');
$(dashboardSecurity).attr("href", '/api/'+ role +'profile/'+ id + '/security');
$(dashboardSettings).attr("href", '/api/'+ role +'profile/'+ id + '/settings');
$(dashboardAccount).attr("href", '/api/'+ role +'profile/'+ id + '/account');
$(dashboardFaq).attr("href", '/api/'+ role +'profile/'+ id + '/faq');
$(dashboardSupport).attr("href", '/api/'+ role +'profile/'+ id + '/support');
$(accountDashboard).attr("href", '/api/'+ role +'profile/'+ id + '/account');
$(dashboardProfile).attr("href", '/api/'+ role +'profile/'+ id + '/profile');
$(supportDashboard).attr("href", '/api/'+ role +'profile/'+ id + '/support');
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
