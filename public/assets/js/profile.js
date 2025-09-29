$(document).ready(function(){
let profileIndex = document.getElementById("profileIndex");
let profileTrading = document.getElementById("profileTrade")
let profileICO = document.getElementById("profileICO")
let profileUser = document.getElementById("profileUser")
let profileBuy = document.getElementById("profileBuy")
let profileGateways = document.getElementById("profileGateways")
let profileAffiliate = document.getElementById("profileAffiliate")
let profileWallet = document.getElementById("profileWallet")
let profileSecurity = document.getElementById("profileSecurity")
let profileSettings = document.getElementById("profileSettings")
let profileAccount = document.getElementById("profileAccount")
let profileFaq = document.getElementById("profileFaq")
let profileSupport = document.getElementById("profileSupport")
let accountProfile = document.getElementById("accountprofile")
let profileProfile = document.getElementById("profileProfile")
let supportProfile = document.getElementById("supportprofile")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(profileIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(profileTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(profileICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(profileUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(profileBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(profileGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(profileAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(profileWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(profileSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(profileSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(profileAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(profileFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(profileSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(profileProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/data/profile');
$(supportProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
}



});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/data/${localStorage.getItem("profile_id")}/`,
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
