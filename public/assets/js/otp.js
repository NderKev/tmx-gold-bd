$(document).ready(function(){
  let AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';

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
      
      if(err.status === 400) {
        //alert(err.message);
        $("#otp_placement_error").html('Wrong OTP');
      }
      else if (err.status === 403){
        $("#otp_placement_error").html('error with verifying otp');
      }
      else{
        $("#otp_placement_error").html('Authorization error');
      }
      $("#otp_placement_error").html('Wrong OTP');
       refresh();
    },
    success: function (results) {
       /**$("#otp_placement_error").html('OTP Verfication Successful');
        window.location.href = '/index.html'; */
        //console.log(success)
    if (results.messsage === "verified" || results.success == true){
         $("#otp_placement_error").html('OTP Verfication Successful');
        window.location.href = '/index.html'
      }
      else if (results.message !== 'verified'){
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
