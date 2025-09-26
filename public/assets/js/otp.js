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
      contentType: "application/json",  // keep JSON request
      data: JSON.stringify({ otp }),
      // ✅ handle specific HTTP codes here:
      statusCode: {
        204: function () {
          $("#otp_placement_error").html('OTP Verification Successful');
          window.location.href = '/index.html';
        },
        400: function () {
          $("#otp_placement_error").html('Wrong OTP');
          refresh();
        },
        403: function () {
          $("#otp_placement_error").html('Error verifying OTP');
          refresh();
        }
      },
      error: function (xhr) {
        // fallback for other errors
        $("#otp_placement_error").html('Authorization error');
        refresh();
      },
      success: function (data) {
        // This only runs if a JSON body is returned (not for 204)
        if (data && data.message === "verified") {
          $("#otp_placement_error").html('OTP Verification Successful');
          window.location.href = '/index.html';
        }
      }
    });
  });
});