$(document).ready(function(){
let paymentIndex = document.getElementById("paymentIndex");
let paymentTrading = document.getElementById("paymentTrade")
let paymentICO = document.getElementById("paymentICO")
let paymentUser = document.getElementById("paymentUser")
let paymentBuy = document.getElementById("paymentBuy")
let paymentGateways = document.getElementById("paymentGateways")
let paymentAffiliate = document.getElementById("paymentAffiliate")
let paymentWallet = document.getElementById("paymentWallet")
let paymentSecurity = document.getElementById("paymentSecurity")
let paymentSettings = document.getElementById("paymentSettings")
let paymentAccount = document.getElementById("paymentAccount")
let paymentFaq = document.getElementById("paymentFaq")
let paymentSupport = document.getElementById("paymentSupport")
let accountPayment = document.getElementById("accountPayment")
let paymentProfile = document.getElementById("paymentProfile")
let supportPayment = document.getElementById("supportPayment")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn || role !== 'admin'){
  window.location.href = "/index.html";
}else{
$(paymentIndex).attr("href", '/api/admin'+'/data/profile/'+ id);
$(paymentTrading).attr("href", '/api/admin'+'/data/profile/'+ id + '/trade');
$(paymentICO).attr("href", '/api/admin'+'/data/profile/'+ id + '/ico');
$(paymentUser).attr("href", '/api/admin'+'/data/profile/'+ id + '/user');
$(paymentBuy).attr("href", '/api/admin'+'/data/profile/'+ id + '/buy');
$(paymentGateways).attr("href", '/api/admin'+'/data/profile/'+ id + '/gateways');
$(paymentAffiliate).attr("href", '/api/admin'+'/data/profile/'+ id + '/affiliate');
$(paymentWallet).attr("href", '/api/admin'+'/data/profile/'+ id + '/wallet');
$(paymentSecurity).attr("href", '/api/admin'+'/data/profile/'+ id + '/security');
$(paymentSettings).attr("href", '/api/admin'+'/data/profile/'+ id + '/settings');
$(paymentAccount).attr("href", '/api/admin'+'/data/profile/'+ id + '/account');
$(paymentFaq).attr("href", '/api/admin'+'/data/profile/'+ id + '/faq');
$(paymentSupport).attr("href", '/api/admin'+'/data/profile/'+ id + '/support');
$(paymentAccount).attr("href", '/api/admin'+'/data/profile/'+ id + '/account');
$(paymentFaq).attr("href", '/api/admin'+'/data/profile/'+ id + '/faq');
$(paymentSupport).attr("href", '/api/admin'+'/data/profile/'+ id + '/support');
$(accountPayment).attr("href", '/api/admin'+'/data/profile/'+ id + '/account');
$(paymentProfile).attr("href", '/api/admin'+'/data/profile/'+ id + '/data/profile');
$(supportPayment).attr("href", '/api/admin'+'/data/profile/'+ id + '/support');
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