$(document).ready(function(){
  let AUTH_BACKEND_URL = 'https://www.tmxgoldcoin.co';

$("#verify-otp").click(function(e){
    e.preventDefault()
    function refresh(){
    $("#otp-ver-code").val('')
     }

    let otp = document.getElementById('otp-ver-code').value;
    
    if(otp === '') {
    $("#otp_placement_error").html('*Email is required')
    return
  }
 
  $.ajax({
    url: `${AUTH_BACKEND_URL}/api/user/verify`,
    dataType: "JSON",
    contentType: "application/json",
    method: "POST",
    data: JSON.stringify({
      'otp': otp
    }),
    error: (err) => {
      refreshLogin();
      if(err.status === 401) {
        //alert(err.message);
        $("#otp_placement_error").html('Wrong OTP');
      }
      else if (err.status === 403){
        $("#otp_placement_error").html('error with verifying otp');
      }
      else{
        $("#otp_placement_error").html('Authorization error');
      }
    },
    success: function (results) {
      if (results.success = true){
         $("#otp_placement_error").html('OTP Verfication Successful');
        window.location.href = '/index.html'
      }
      else if (results.status === 401 || results.error){
        //alert("here");
        $("#otp_placement_error").html('Wrong OTP');
        refresh();
        window.location.href = "/";
      }
      else{
        $("#otp_placement_error").html(results.status);
        refresh();
        window.location.href = "/";
      }
    }
  })



});


});