$(document).ready(async function() {
let affiliateIndex = document.getElementById("affiliateIndex");
let affiliateTrading = document.getElementById("affiliateTrade")
let affiliateICO = document.getElementById("affiliateICO")
let affiliateUser = document.getElementById("affiliateUser")
let affiliateBuy = document.getElementById("affiliateBuy")
let affiliateGateways = document.getElementById("affiliateGateways")
let affiliateAffiliate = document.getElementById("affiliateAffiliate")
let affiliateWallet = document.getElementById("affiliateWallet")
let affiliateSecurity = document.getElementById("affiliateSecurity")
let affiliateSettings = document.getElementById("affiliateSettings")
let affiliateAccount = document.getElementById("affiliateAccount")
let affiliateFaq = document.getElementById("affiliateFaq")
let affiliateSupport = document.getElementById("affiliateSupport")
let accountAffiliate = document.getElementById("accountAffiliate")
let affiliateProfile = document.getElementById("affiliateProfile")
let supportAffiliate = document.getElementById("supportAffiliate")
let affiliateTransactions = document.getElementById("affiliateTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(affiliateIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(affiliateTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(affiliateICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(affiliateUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(affiliateBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(affiliateGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(affiliateAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(affiliateWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(affiliateSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(affiliateSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(affiliateAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(affiliateFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(affiliateSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(affiliateProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(affiliateTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');


 const userId = localStorage.getItem("user_id"); // or from JWT decode/session
 const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";
   const $linkField = $("#affiliateLink");
   const $message = $("#affiliateMessage");

    if (!userId) {
      $linkField.val("⚠️ Please log in to view your referral info.");
      return;
    }

    try {
      // Fetch referral link + stats
      const res = await $.ajax({
        url: `${AUTH_BACKEND_URL}/api/user/referral/${userId}`,
        method: "GET",
        dataType: "json",
      });
      console.log("data :" + res);
      if (res.success && res.referral_link) {
        // Set referral link
        $linkField.val(res.referral_link);

        // ✅ Update stats
        $("#statClicks").text(res.stats?.total_clicks || 0);
        $("#statSignups").text(res.stats?.total_signups || 0);
        $("#statConversions").text(res.stats?.total_conversions || 0);
        $("#statCommission").text(res.stats?.total_commission?.toFixed(2) || "0.00");
      } else {
        $linkField.val("Error fetching referral data.");
      }
    } catch (err) {
      console.error(err);
      $linkField.val("⚠️ Could not load affiliate info.");
    }

    // 📋 Copy button
    $("#copyAffiliateLink").click(function (e) {
      e.preventDefault();
      const link = $("#affiliateLink").val();
      navigator.clipboard
        .writeText(link)
        .then(() => {
          $("#affiliateMessage")
            .html("✅ Copied to clipboard!")
            .css("color", "green");
          setTimeout(() => $("#affiliateMessage").html(""), 2000);
        })
        .catch(() => {
          $("#affiliateMessage")
            .html("⚠️ Unable to copy")
            .css("color", "red");
        });
    });
}
});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
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
