$(document).ready(function(){
let indexAdmin = document.getElementById("indexAdmin");
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

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn || role !== 'admin'){
  window.location.href = "/index.html";
}else{
$(indexAdmin).attr("href", '/api/admin'+'/profile/'+ id);
$(adminTrading).attr("href", '/api/admin'+'/profile/'+ id + '/trade');
$(adminICO).attr("href", '/api/admin'+'/profile/'+ id + '/ico');
$(adminUser).attr("href", '/api/admin'+'/profile/'+ id + '/user');
$(adminBuy).attr("href", '/api/admin'+'/profile/'+ id + '/buy');
$(adminGateways).attr("href", '/api/admin'+'/profile/'+ id + '/gateways');
$(adminAffiliate).attr("href", '/api/admin'+'/profile/'+ id + '/affiliate');
$(adminWallet).attr("href", '/api/admin'+'/profile/'+ id + '/wallet');
$(adminSecurity).attr("href", '/api/admin'+'/profile/'+ id + '/security');
$(adminSettings).attr("href", '/api/admin'+'/profile/'+ id + '/settings');
$(adminAccount).attr("href", '/api/admin'+'/profile/'+ id + '/account');
$(adminFaq).attr("href", '/api/admin'+'/profile/'+ id + '/faq');
$(adminSupport).attr("href", '/api/admin'+'/profile/'+ id + '/support');
$(accountAdmin).attr("href", '/api/admin'+'/profile/'+ id + '/account');
$(adminProfile).attr("href", '/api/admin'+'/profile/'+ id + '/data/profile');
$(supportAdmin).attr("href", '/api/admin'+'/profile/'+ id + '/support');
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