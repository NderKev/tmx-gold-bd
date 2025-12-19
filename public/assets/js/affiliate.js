$(document).ready(function () {
  const AUTH_BACKEND_URL = "https://www.tmxgoldcoin.co";
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("tmx_gold_name");

  // ✅ Redirect if not logged in
  if (!userName || !userId || !role) {
    window.location.href = "/index.html";
    return;
  }

  // =============================
  // 🌐 Dynamic Menu Links
  // =============================
  const links = {
    affiliateIndex: "profile",
    affiliateTrading: "trade",
    affiliateICO: "ico",
    affiliateUser: "user",
    affiliateBuy: "buy",
    affiliateGateways: "gateways",
    affiliateAffiliate: "affiliate",
    affiliateWallet: "wallet",
    affiliateSecurity: "security",
    affiliateSettings: "settings",
    affiliateAccount: "account",
    affiliateFaq: "faq",
    affiliateSupport: "support",
    accountAffiliate: "account",
    affiliateProfile: "profile",
    supportAffiliate: "support",
    affiliateTransactions: "transactions",
  };

  Object.entries(links).forEach(([id, endpoint]) => {
    const el = document.getElementById(id);
    if (el) el.href = `/api/${role}/profile/${userId}/${endpoint}`;
  });

  // =============================
  // 🪙 Load Affiliate Info
  // =============================
  async function loadAffiliateInfo() {
    const $linkField = $("#affiliateLink");
    const $message = $("#affiliateMessage");

    try {
      const resp = await fetch(
        `${AUTH_BACKEND_URL}/api/user/referral/${encodeURIComponent(userId)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      if (!resp.ok) {
        console.error("Referral API error:", resp.status, resp.statusText);
        $linkField.val("Error fetching referral data.");
        return;
      }

      const res = await resp.json().catch(() => ({}));
      console.log("Referral response:", res);

      if (res && res.success && res.referral_link) {
        $linkField.val(res.referral_link);
        $("#statClicks").text(res.stats?.total_clicks || 0);
        $("#statSignups").text(res.stats?.total_signups || 0);
        $("#statConversions").text(res.stats?.total_conversions || 0);
        $("#statCommission").text(
          (Number(res.stats?.total_commission) || 0).toFixed(2)
        );
      } else {
        $linkField.val("Error fetching referral data.");
      }
    } catch (err) {
      console.error("Network error fetching referral:", err);
      $linkField.val("⚠️ Could not load affiliate info.");
      $message.text("Network or server error. Try again later.");
    }
  }

  loadAffiliateInfo();

  // =============================
  // 📋 Copy Button
  // =============================
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

  // =============================
  // 🔐 Session Validation
  // =============================
  setInterval(function () {
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${role}/profile/${userId}`,
      dataType: "json",
      contentType: "application/json",
      method: "GET",
      error: (err) => {
        if (err.status === 401) {
          alert("Session Expired! Kindly login again.");
          localStorage.clear();
          window.location.href = "/index.html";
        }
      },
    });
  }, 1800000); // 30 minutes

  // =============================
  // 🔧 Role-based Menu Visibility
  // =============================
  const userRole = localStorage.getItem("role");
  if (userRole === "customer") {
    $("#icoMenu, #paymentMenu").remove(); // hide or remove menu items
  }
});