$(document).ready(function(){
let userIndex = document.getElementById("userIndex");
let userTrading = document.getElementById("userTrade")
let userICO = document.getElementById("userICO")
let userUser = document.getElementById("userUser")
let userBuy = document.getElementById("userBuy")
let userGateways = document.getElementById("userGateways")
let userAffiliate = document.getElementById("userAffiliate")
let userWallet = document.getElementById("userWallet")
let userSecurity = document.getElementById("userSecurity")
let userSettings = document.getElementById("userSettings")
let userAccount = document.getElementById("userAccount")
let userFaq = document.getElementById("userFaq")
let userSupport = document.getElementById("userSupport")
let accountUser = document.getElementById("accountUser")
let userProfile = document.getElementById("userProfile")
let supportUser = document.getElementById("supportUser")
let userTransactions = document.getElementById("userTransactions")
let BecomeAffiiliate = document.getElementById("BecomeAffiiliate");
let BuyandSell = document.getElementById("BuyandSell");


var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(userIndex).attr("href", '//'+ role +'/profile/'+ id);
$(userTrading).attr("href", '//'+ role +'/profile/'+ id + '/trade');
$(userICO).attr("href", '//'+ role +'/profile/'+ id + '/ico');
$(userUser).attr("href", '//'+ role +'/profile/'+ id + '/user');
$(userBuy).attr("href", '//'+ role +'/profile/'+ id + '/buy');
$(userGateways).attr("href", '//'+ role +'/profile/'+ id + '/gateways');
$(userAffiliate).attr("href", '//'+ role +'/profile/'+ id + '/affiliate');
$(userWallet).attr("href", '//'+ role +'/profile/'+ id + '/wallet');
$(userSecurity).attr("href", '//'+ role +'/profile/'+ id + '/security');
$(userSettings).attr("href", '//'+ role +'/profile/'+ id + '/settings');
$(userAccount).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(userFaq).attr("href", '//'+ role +'/profile/'+ id + '/faq');
$(userSupport).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(accountUser).attr("href", '//'+ role +'/profile/'+ id + '/account');
$(userProfile).attr("href", '//'+ role +'/profile/'+ id + '/profile');
$(supportUser).attr("href", '//'+ role +'/profile/'+ id + '/support');
$(userTransactions).attr("href", '//'+ role +'/profile/'+ id + '/transactions');
$(BecomeAffiiliate).attr("href", '//'+ role +'/profile/'+ id + '/affiliate');
$(BuyandSell).attr("href", '//'+ role +'/profile/'+ id + '/buy');
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
