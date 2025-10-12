$(document).ready(function () {
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
$("#sendOtpBtn").click(function (e) {
  e.preventDefault();

  const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";
  // const AUTH_BACKEND_URL = "http://localhost:3030";

  const $btn = $("#sendOtpBtn");
  const $error = $("#send_placement_error");

  function refresh() {
    $("#reset_email").val("");
  }

  const email = $("#reset_email").val().trim();
  if (email === "") {
    $error.html("*Email is required");
    return;
  }

  $.ajax({
    url: `${AUTH_BACKEND_URL}/api/user/sendReset`,
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({ email }),

    success: function (data) {
      // ✅ Successful OTP send
      if (data && data.message === "sent") {
        let msg = "✅ OTP Sent Successfully";

        // 🧮 Remaining attempts
        if (data.data && data.data.remaining_attempts !== undefined) {
          msg += `<br>Remaining attempts: <b>${data.data.remaining_attempts}</b>`;
        }

        // 🔒 Handle lockout countdown (if present in success)
        if (data.data && data.data.locked_until) {
          const lockedUntil = new Date(data.data.locked_until);
          const now = new Date();

          if (lockedUntil > now) {
            msg += `<br>⏳ Cooldown active. You can resend OTP after <b>${Math.ceil(
              (lockedUntil - now) / 1000 / 60
            )}</b> minutes.`;
            startLockoutCountdown(lockedUntil, $btn, $error, "Send OTP");
          }
        }

        $error.html(msg);

        // ⏳ Redirect after 1 second (if not locked)
        if (!data.data?.locked_until) {
          setTimeout(() => {
            window.location.href = "/reset-password.html";
          }, 1000);
        }

      } else {
        $error.html("⚠️ Unexpected response from server");
      }
    },

    error: function (xhr) {
      refresh();
      const res = xhr.responseJSON;

      // 🔒 Account Lock Handling
      if (res && res.data && res.data.locked_until) {
        const lockedUntil = new Date(res.data.locked_until);
        const now = new Date();
        if (lockedUntil > now) {
          startLockoutCountdown(lockedUntil, $btn, $error, "Send OTP");
          return;
        }
      }

      // ⚠️ Error handling
      if (xhr.status === 400) {
        $error.html("❌ Invalid email address");
      } else if (xhr.status === 403) {
        $error.html("⚠️ Account temporarily locked. Contact support if issue persists.");
      } else if (xhr.status === 429) {
        $error.html("⚠️ Too many requests. Please wait a moment before trying again.");
      } else {
        $error.html("⚠️ Authorization error or server issue.");
      }
    },
  });
});



/**
 * 🕒 Countdown Timer for Lockout + Button Disable
 */
function startLockoutCountdown(lockedUntil, $btn, $error, defaultText) {
  $btn.prop("disabled", true).addClass("disabled");
  $btn.text("Locked");

  function updateCountdown() {
    const now = new Date();
    const diffMs = lockedUntil - now;

    if (diffMs <= 0) {
      clearInterval(timer);
      $btn.prop("disabled", false).removeClass("disabled").text(defaultText);
      $error.html("✅ You can now request another OTP.");
      return;
    }

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000)
      .toString()
      .padStart(2, "0");

    $error.html(`⏳ Please wait <b>${minutes}:${seconds}</b> before requesting another OTP`);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}

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
    //checkEmail();
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