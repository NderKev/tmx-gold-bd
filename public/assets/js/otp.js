$(document).ready(function () {
const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
document.getElementById("verify-otp").addEventListener("click", async (e) => {
  e.preventDefault();

  const otpInput = document.getElementById("otp-ver-code");
  const errorField = document.getElementById("otp_placement_error");
  const otp = otpInput.value.trim();

  // Helper to clear the OTP field
  const refresh = () => (otpInput.value = "");

  // Input validation
  if (!otp) {
    errorField.innerHTML = "*OTP is required";
    return;
  }

  try {
    const response = await fetch(`${AUTH_BACKEND_URL}/api/user/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json().catch(() => ({})); // safely parse JSON if present

    switch (response.status) {
      case 204:
        errorField.innerHTML = "✅ OTP Verification Successful";
        window.location.href = "/index.html";
        break;

      case 200:
        if (data?.result === "verified" || data?.data?.result === "verified") {
          errorField.innerHTML = "✅ OTP Verified Successfully";
          window.location.href = "/index.html";
        } else {
          errorField.innerHTML = "⚠️ Unexpected Response, Please Retry";
          refresh();
        }
        break;

      case 400:
        errorField.innerHTML = "❌ Invalid OTP, please try again.";
        refresh();
        break;

      case 403:
        errorField.innerHTML = "⚠️ OTP Expired, please request a new one.";
        refresh();
        break;

      case 404:
        errorField.innerHTML = "❌ Verification error, please retry.";
        refresh();
        break;

      default:
        errorField.innerHTML = "⚠️ Unknown server response.";
        refresh();
        break;
    }
  } catch (error) {
    console.error("Network or Authorization Error:", error);
    errorField.innerHTML =
      "❌ Network or authorization error. Please check your connection.";
    refresh();
  }
});


  $("#resendOtpBtn").click(function () {
        const email = localStorage.getItem("tmx_gold_name"); // ensure email is available
        console.log(email);
        $("#resend_status").html('Resending OTP...');

      $.ajax({
        url: `${AUTH_BACKEND_URL}/api/user/resend-otp`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email : email}),
        success: function (res) {
          $("#otp_placement_error").html('✅ New OTP sent to your email');
        },
        error: function (xhr) {
          $("#otp_placement_error").html(`❌ ${xhr.responseJSON?.message || 'Failed to resend OTP'}`);
        }
      });
    });
});