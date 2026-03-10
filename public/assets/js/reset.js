$(document).ready(function () {
  const AUTH_BACKEND_URL = window.location.hostname === 'localhost'
    ? "http://localhost:7000"
    : 'https://tmxgoldcoin.co';

  // Track active lockout timer to prevent duplicate intervals
  let lockoutTimer = null;

  // Get email from sessionStorage if available (from forgot password page)
  const savedEmail = sessionStorage.getItem('reset_email');
  if (savedEmail) {
    $('#reset_email').val(savedEmail);
  }

  $("#sendOtpBtn").click(function (e) {
    e.preventDefault();

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

    // Store email in sessionStorage for the reset password page
    sessionStorage.setItem('reset_email', email);

    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/sendReset`,
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      xhrFields: { withCredentials: true },
      data: JSON.stringify({ email }),

      success: function (data) {
        // Successful OTP send
        if (data && data.message === "sent") {
          // Show success message then redirect
          let msg = "OTP Sent Successfully";
          $error.html(msg);

          setTimeout(() => {
            window.location.href = "/reset-password.html";
          }, 1000);

        } else {
          $error.html("Unexpected response from server");
        }
      },

      error: function (xhr) {
        refresh();
        const res = xhr.responseJSON;

        // Account Lock Handling - check for locked_until in response
        if (res && res.data && res.data.locked_until) {
          const lockedUntil = new Date(res.data.locked_until);
          const now = new Date();
          if (lockedUntil > now) {
            startLockoutCountdown(lockedUntil, $btn, $error, "Send OTP");
            return;
          }
        }

        // Error handling
        if (xhr.status === 400) {
          $error.html("Invalid email address");
        } else if (xhr.status === 403) {
          $error.html("Account temporarily locked. Contact support if issue persists.");
        } else if (xhr.status === 429) {
          // Handle rate limit response
          if (res && res.data && res.data.locked_until) {
            const lockedUntil = new Date(res.data.locked_until);
            startLockoutCountdown(lockedUntil, $btn, $error, "Send OTP");
          } else {
            $error.html("Too many requests. Please wait 30 minutes before trying again.");
          }
        } else {
          $error.html("Authorization error or server issue.");
        }
      },
    });
  });



  /**
   * Countdown Timer for Lockout + Button Disable
   */
  function startLockoutCountdown(lockedUntil, $btn, $error, defaultText) {
    // Clear any previously running timer to avoid stacking intervals
    if (lockoutTimer) {
      clearInterval(lockoutTimer);
      lockoutTimer = null;
    }

    $btn.prop("disabled", true).addClass("disabled");
    $btn.text("Locked");

    function updateCountdown() {
      const now = new Date();
      const diffMs = lockedUntil - now;

      if (diffMs <= 0) {
        clearInterval(lockoutTimer);
        lockoutTimer = null;
        $btn.prop("disabled", false).removeClass("disabled").text(defaultText);
        $error.html("You can now request another OTP.");
        return;
      }

      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000)
        .toString()
        .padStart(2, "0");

      $error.html(`Please wait <b>${minutes}:${seconds}</b> before requesting another OTP`);
    }

    updateCountdown();
    lockoutTimer = setInterval(updateCountdown, 1000);
  }

  function checkPassword() {
    let password = $("#password").val();
    let confirmpassword = $("#c_password").val();
    if (password === '') {
      $("#reset_placement_error").html('Please enter Password');
    } else if (confirmpassword === '') {
      $("#reset_placement_error").html('Please enter confirm password');
    } else if (confirmpassword.length > 7 && confirmpassword != password) {
      $("#reset_placement_error").html('Password did not match: Please try again...');
      return false;
    } else if (password.length < 8 || confirmpassword.length < 8) {
      $("#reset_placement_error").html('Password must be 8 or more characters');
      return false;
    } else {
      $("#reset_placement_error").html('Password matched');
      return true;
    }
  }

  $("#c_password").keyup(checkPassword);

  // Get stored email for the reset password page
  const resetEmail = sessionStorage.getItem('reset_email');

  $("#resetPasswordBtn").click(function (e) {
    e.preventDefault();

    function refresh() {
      $("#otp").val('');
      $("#password").val('');
      $("#c_password").val('');
    }

    const otp = $("#otp").val().trim();
    const password = $("#password").val();

    if (!otp) {
      $("#send_placement_error").html('*OTP is required');
      return;
    }
    if (!password) {
      $("#send_placement_error").html('*Password is required');
      return;
    }

    // Include email in the request if available
    const requestData = { otp: otp, password: password };
    if (resetEmail) {
      requestData.email = resetEmail;
    }

    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/updatePassword`,
      method: "POST",
      contentType: "application/json",
      xhrFields: { withCredentials: true },
      data: JSON.stringify(requestData),
      statusCode: {
        204: function () {
          $("#reset_placement_error").html('Password Reset Successful');
          // Clear stored email after successful reset
          sessionStorage.removeItem('reset_email');
          window.location.href = '/index.html';
        },
        400: function (response) {
          // Check for specific error messages
          const msg = response.responseJSON?.message || '';
          if (msg === 'invalidOTP') {
            $("#reset_placement_error").html('Invalid OTP. Please try again.');
          } else if (msg === 'otpExpired') {
            $("#reset_placement_error").html('OTP has expired. Please request a new one.');
          } else {
            $("#reset_placement_error").html('Invalid OTP');
          }
          refresh();
        },
        403: function () {
          $("#reset_placement_error").html('User Not Registered');
          refresh();
        }
      },
      error: function (xhr) {
        $("#reset_placement_error").html('Authorization error');
        refresh();
      },
      success: function (data) {
        if (data && data.data.message === "passwordUpdated" && data.message === "passwordUpdated") {
          $("#reset_placement_error").html('Password Reset Successful');
          // Clear stored email after successful reset
          sessionStorage.removeItem('reset_email');
          window.location.href = '/index.html';
        }
      }
    });
  });

  // Toggle Password visibility
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
});
