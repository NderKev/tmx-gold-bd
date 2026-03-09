$(document).ready(function(){
let faqIndex = document.getElementById("faqIndex");
let faqTrading = document.getElementById("faqTrade")
let faqICO = document.getElementById("faqICO")
let faqUser = document.getElementById("faqUser")
let faqBuy = document.getElementById("faqBuy")
let faqGateways = document.getElementById("faqGateways")
let faqAffiliate = document.getElementById("faqAffiliate")
let faqWallet = document.getElementById("faqWallet")
let faqSecurity = document.getElementById("faqSecurity")
let faqSettings = document.getElementById("faqSettings")
let faqAccount = document.getElementById("faqAccount")
let faqFaq = document.getElementById("faqFaq")
let faqSupport = document.getElementById("faqSupport")
let accountFaq = document.getElementById("accountFaq")
let faqProfile = document.getElementById("faqProfile")
let supportFaq = document.getElementById("supportFaq")
let faqTransactions = document.getElementById("faqTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(faqIndex).attr("href", '//'+ role +'/profile/'+ id);
$(faqTrading).attr("href", '//'+ role +'/profile/'+ id + '/trade');
$(faqICO).attr("href", '//'+ role +'/profile/'+ id + '/ico');
$(faqUser).attr("href", '//'+ role +'/profile/'+ id + '/user');
$(faqBuy).attr("href", '//'+ role +'/profile/'+ id + '/buy');
$(faqGateways).attr("href", '//'+ role +'/profile/'+ id + '/gateways');
$(faqAffiliate).attr("href", '//'+ role +'/profile/'+ id + '/affiliate');
$(faqWallet).attr("href", '//'+ role +'/profile/'+ id + '/wallet');
$(faqSecurity).attr("href", '//'+ role +'/profile/'+ id + '/security');
$(faqSettings).attr("href", '//'+ role +'/profile/'+ id + '/settings');
$(faqAccount).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(faqFaq).attr("href", '//'+ role +'/profile/'+ id + '/faq');
$(faqSupport).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(accountFaq).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(faqProfile).attr("href", '//'+ role +'/profile/'+ id + '/profile');
$(supportFaq).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(faqTransactions).attr("href", '//'+ role +'/profile/'+ id + '/transactions');
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
