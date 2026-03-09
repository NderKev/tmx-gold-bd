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
let paymentTransactions = document.getElementById("paymentTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn || role !== 'admin'){
  window.location.href = "/index.html";
}else{
$(paymentIndex).attr("href", '//admin'+'/profile/'+ id);
$(paymentTrading).attr("href", '//admin'+'/profile/'+ id + '/trade');
$(paymentICO).attr("href", '//admin'+'/profile/'+ id + '/ico');
$(paymentUser).attr("href", '//admin'+'/profile/'+ id + '/user');
$(paymentBuy).attr("href", '//admin'+'/profile/'+ id + '/buy');
$(paymentGateways).attr("href", '//admin'+'/profile/'+ id + '/gateways');
$(paymentAffiliate).attr("href", '//admin'+'/profile/'+ id + '/affiliate');
$(paymentWallet).attr("href", '//admin'+'/profile/'+ id + '/wallet');
$(paymentSecurity).attr("href", '//admin'+'/profile/'+ id + '/security');
$(paymentSettings).attr("href", '//admin'+'/profile/'+ id + '/settings');
$(paymentAccount).attr("href", '//admin'+'/profile/'+ id + '/account');
$(paymentFaq).attr("href", '//admin'+'/profile/'+ id + '/faq');
$(paymentSupport).attr("href", '//admin'+'/profile/'+ id + '/support');
$(paymentAccount).attr("href", '//admin'+'/profile/'+ id + '/account');
$(paymentFaq).attr("href", '//admin'+'/profile/'+ id + '/faq');
$(paymentSupport).attr("href", '//admin'+'/profile/'+ id + '/support');
$(accountPayment).attr("href", '//admin'+'/profile/'+ id + '/account');
$(paymentProfile).attr("href", '//admin'+'/profile/'+ id + '/profile');
$(supportPayment).attr("href", '//admin'+'/profile/'+ id + '/support');
$(paymentTransactions).attr("href", '//'+ role +'/profile/'+ id + '/transactions');
}

});

setInterval(function(){
  const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
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