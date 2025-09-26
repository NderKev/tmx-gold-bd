$(document).ready(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';

  $("#verify-otp").click(function(e){
    e.preventDefault();

    function refresh(){
      $("#otp-ver-code").val('');
    }

    const otp = $("#otp-ver-code").val().trim();

    if(!otp) {
      $("#otp_placement_error").html('*OTP is required');
      return;
    }

    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/verify`,
      dataType: "json",
      contentType: "application/json",
      method: "POST",
      data: JSON.stringify({ otp }),
      error: function(err) {
        if (err.status === 400) {
          $("#otp_placement_error").html('Wrong OTP');
        } else if (err.status === 403) {
          $("#otp_placement_error").html('Error verifying OTP');
        } else {
          $("#otp_placement_error").html('Authorization error');
        }
        refresh();
      },
      success: function (results) {
        if (results.status === 204) {
          $("#otp_placement_error").html('OTP Verification Successful');
          window.location.href = '/index.html';
        } else {
          $("#otp_placement_error").html('Already verified OTP');
          refresh();
        }
      }
    });
  });
});