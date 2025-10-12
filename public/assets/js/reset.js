$(document).ready(function () {
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';

  $("#sendOtpBtn").click(function (e) {
    e.preventDefault();
     checkEmail();
    function refresh() {
      $("#email").val('');
    }

    const email = $("#email").val();

    if (!email) {
      $("#send_placement_error").html('*Email is required');
      return;
    }



    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/sendReset`,
      method: "POST",
      contentType: "application/json",  // keep JSON request
      data: JSON.stringify({ email : email }),
      // ✅ handle specific HTTP codes here:
      statusCode: {
        200: function () {
          $("#send_placement_error").html('OTP Sent Successfully');
          window.location.href = '/index.html';
        },
        400: function () {
          $("#send_placement_error").html('Error Sending OTP');
          refresh();
        },
        403: function () {
          $("#send_placement_error").html('Error Sending OTP');
          refresh();
        }
      },
      error: function (xhr) {
        // fallback for other errors
        $("#send_placement_error").html('Authorization error');
        refresh();
      },
      success: function (data) {
        if (data && data.data.message === "sent") {
          $("#send_placement_error").html('OTP Sent Successfully');
          window.location.href = '/reset-password.html';
        }
      }
    });
  });


  function checkEmail() {
  const email = document.getElementById("email").value.trim();
  const respMessage = document.getElementById("successMessage");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple regex
  if (emailPattern.test(email)) {
    respMessage.innerText = '✅ Valid email';
    //alert("");
  } else {
    respMessage.innerText = '❌ Invalid email';
  }
}

    function checkPassword() {
    let password = $("#password").val();
    let confirmpassword = $("#c_password").val();
    if (password === ''){
      $("#reset_placement_error").html('Please enter Password');
    }
    else if (confirmpassword === ''){
      $("#reset_placement_error").html('Please enter confirm password')
    }
    else if (confirmpassword.length > 7 && confirmpassword != password) {
      $("#reset_placement_error").html('Password did not match: Please try again...');
      return false;
    }
    else if (password.length < 8 || confirmpassword.length < 8){
      $("#reset_placement_error").html('passsword must be 8 or more characters');
      return false;
    }

    else{
      $("#reset_placement_error").html('password matched');
      return true;
    }
  }

  $("#c_password").keyup(checkPassword);

    $("#resetPasswordBtn").click(function (e) {
    e.preventDefault();
    checkEmail();
    function refresh() {
      $("#otp").val('');
      $("#password").val('');
      $("#c_password").val('');
    }

    const otp = $("#otp").val().trim();
    const passsword = $("#password").val()

    if (!otp) {
      $("#send_placement_error").html('*OTP is required');
      return;
    }
       if (!password) {
      $("#send_placement_error").html('*password is required');
      return;
    }


    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/updatePassword`,
      method: "POST",
      contentType: "application/json",  // keep JSON request
      data: JSON.stringify({ otp : otp, password : passsword }),
      // ✅ handle specific HTTP codes here:
      statusCode: {
        204: function () {
          $("#reset_placement_error").html('Password Reset Successful');
          window.location.href = '/index.html';
        },
        400: function () {
          $("#reset_placement_error").html('Invalid OTP');
          refresh();
        },
        403: function () {
          $("#reset_placement_error").html('User Not Registered');
          refresh();
        }
      },
      error: function (xhr) {
        // fallback for other errors
        $("#_placement_error").html('Authorization error');
        refresh();
      },
      success: function (data) {
        // This only runs if a JSON body is returned (not for 204)
        if (data && data.data.message ===  "passwordUpdated" && data.message === "passwordUpdated") {
          $("#reset_placement_error").html('Password Reset Successful');
          window.location.href = '/index.html';
        }
      }
    });
  });
});




  document.getElementById("togglePassword").addEventListener("click", function () {
    const input = document.getElementById("password");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    // Toggle icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // Toggle Confirm Password visibility
  document.getElementById("toggleCPassword").addEventListener("click", function () {
    const input = document.getElementById("c_password");
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    // Toggle icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });