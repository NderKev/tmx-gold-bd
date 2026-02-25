$(document).ready(function(){
let indexAdmin = document.getElementById("indexAdmin");
let adminUsers = document.getElementById("adminUsers");
let adminTrading = document.getElementById("adminTrading")
let adminICO = document.getElementById("adminICO")
let adminUser = document.getElementById("adminUser")
let adminBuy = document.getElementById("adminBuy")
let adminGateways = document.getElementById("adminGateways")
let adminAffiliate = document.getElementById("adminAffiliate")
let adminWallet = document.getElementById("adminWallet")
let adminSecurity = document.getElementById("adminSecurity")
let adminSettings = document.getElementById("adminSettings")
let adminAccount = document.getElementById("adminAccount")
let adminFaq = document.getElementById("adminFaq")
let adminSupport = document.getElementById("adminSupport")
let accountAdmin = document.getElementById("accountAdmin")
let adminProfile = document.getElementById("adminProfile")
let supportAdmin = document.getElementById("supportAdmin")
let adminTransactions = document.getElementById("adminTransactions");

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn || role !== 'admin'){
  window.location.href = "/index.html";
}else{
$(indexAdmin).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id);
$(adminUsers).attr("href", '/tmxGold/v1/'+ role +'/profile/'+ id + '/users');
$(adminTrading).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/trade');
$(adminICO).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/ico');
$(adminUser).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/user');
$(adminBuy).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/buy');
$(adminGateways).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/gateways');
$(adminAffiliate).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/affiliate');
$(adminWallet).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/wallet');
$(adminSecurity).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/security');
$(adminSettings).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/settings');
$(adminAccount).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/account');
$(adminFaq).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/faq');
$(adminSupport).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/support');
$(accountAdmin).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/account');
$(adminProfile).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/profile');
$(supportAdmin).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/support');
$(adminTransactions).attr("href", '/tmxGold/v1/admin'+'/profile/'+ id + '/transactions');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/tmxGold/v1/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
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