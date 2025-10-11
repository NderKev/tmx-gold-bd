$(document).ready(function () {
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';

  $("#verify-otp").click(function (e) {
    e.preventDefault();

    function refresh() {
      $("#otp-ver-code").val('');
    }

    const otp = $("#otp-ver-code").val().trim();

    if (!otp) {
      $("#otp_placement_error").html('*OTP is required');
      return;
    }

    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/verify`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ otp: otp }),

      statusCode: {
        204: function () {
          $("#otp_placement_error").html("✅ OTP Verification Successful");
          window.location.href = "/index.html";
        },
       400: function (xhr) {
          $("#otp_placement_error").html(xhr.responseJSON?.message || '❌ Invalid or expired OTP');
          refresh();
        },
        403: function () {
          $("#otp_placement_error").html("⚠️ Error verifying OTP");
          refresh();
        },
      },
      success: function (data, textStatus, xhr) {
        // handle valid JSON responses (status 200)
        if (xhr.status === 200 && data) {
          if (data.message === "verified" || data.data?.message === "verified") {
            $("#otp_placement_error").html("✅ OTP Verification Successful");
            window.location.href = "/index.html";
          } else if (
            data.message === "wrong_otp" ||
            data.message === "invalid" ||
            data.error === "invalid_otp"
          ) {
            $("#otp_placement_error").html("❌ Wrong OTP, please try again.");
            refresh();
          } else {
            $("#otp_placement_error").html("⚠️ Unexpected response.");
            console.log("Unexpected data:", data);
          }
        }
      },

      error: function (xhr) {
        console.error("Error response:", xhr);
        $("#otp_placement_error").html("❌ Authorization or network error");
        refresh();
      },
    });

  });

  $("#resendOtpBtn").click(function () {
  const email = localStorage.getItem("tmx_gold_name"); // ensure email is available
  $("#resend_status").html('Resending OTP...');

      $.ajax({
        url: `${AUTH_BACKEND_URL}/api/user/resend-otp`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email }),
        success: function (res) {
          $("#otp_placement_error").html('✅ New OTP sent to your email');
        },
        error: function (xhr) {
          $("#otp_placement_error").html(`❌ ${xhr.responseJSON?.message || 'Failed to resend OTP'}`);
        }
      });
    });
});