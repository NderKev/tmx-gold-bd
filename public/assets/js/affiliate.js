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

    (async function loadAffiliateInfoFetch() {
  const userId = localStorage.getItem("user_id");
  const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";
  const $linkField = $("#affiliateLink");
  const $message = $("#affiliateMessage");

  if (!userId) {
    $linkField.val("⚠️ Please log in to view your referral info.");
    return;
  }

  try {
    const resp = await fetch(`${AUTH_BACKEND_URL}/api/user/referral/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      credentials: "include", // if you rely on cookies; remove if not needed
    });

    if (!resp.ok) {
      console.error("HTTP error fetching referral:", resp.status, resp.statusText);
      $linkField.val("Error fetching referral data.");
      return;
    }

    const res = await resp.json().catch(() => ({}));
    console.log("Referral response (fetch):", res);

    if (res && res.success && res.referral_link) {
      $linkField.val(res.referral_link);

      const clicks = Number(res.stats?.total_clicks) || 0;
      const signups = Number(res.stats?.total_signups) || 0;
      const conversions = Number(res.stats?.total_conversions) || 0;
      const commission = Number(res.stats?.total_commission) || 0;

      $("#statClicks").text(clicks);
      $("#statSignups").text(signups);
      $("#statConversions").text(conversions);
      $("#statCommission").text(commission.toFixed(2));
    } else {
      $linkField.val("Error fetching referral data.");
    }
  } catch (err) {
    console.error("Network error fetching referral:", err);
    $linkField.val("⚠️ Could not load affiliate info.");
    if ($message.length) $message.text("Network or server error. Try again later.");
  }
})();

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
