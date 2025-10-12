$("#btnLogin").click(function (e) {
  e.preventDefault();

  const AUTH_BACKEND_URL = "https://tmxgoldcoin.co";
  // const AUTH_BACKEND_URL = "http://localhost:3030";

  const $btn = $("#btnLogin");
  const $error = $("#login_placement_error");

  function refreshLogin() {
    $("#log_email").val("");
    $("#log_pword").val("");
  }

  const email = $("#log_email").val().trim();
  const password = $("#log_pword").val().trim();

  if (email === "") {
    $error.html("*Email is required");
    return;
  }
  if (password === "") {
    $error.html("*Password is required");
    return;
  }

  $.ajax({
    url: `${AUTH_BACKEND_URL}/api/user/login`,
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      user_name: email,
      password: password,
    }),

    success: function (results) {
      if (results.success === true || results.status === 200 || results.status === 201) {
        localStorage.setItem("tmx_gold_name", email);
        localStorage.setItem("user_id", results.meta.id);
        localStorage.setItem("role", results.meta.user_roles);
        localStorage.setItem("token", results.data?.[0]?.token || "");
        refreshLogin();

        window.location.href = `${AUTH_BACKEND_URL}/api/${localStorage.getItem(
          "role"
        )}/profile/${localStorage.getItem("user_id")}`;
      } else {
        $error.html(results.message || "Login failed");
      }
    },

    error: function (xhr) {
      refreshLogin();
      const res = xhr.responseJSON;

      // 🔒 Account Lockout Handling
      if (res && res.data && res.data.locked_until) {
        const lockedUntil = new Date(res.data.locked_until);
        const now = new Date();

        if (lockedUntil > now) {
          startLockoutCountdown(lockedUntil, $btn, $error);
          return;
        }
      }

      // ⚠️ Remaining Attempts
      if (res && res.data && res.data.remaining_attempts !== undefined) {
        $error.html(
          `❌ ${res.message || "Wrong password"}<br>Remaining attempts: <b>${res.data.remaining_attempts}</b>`
        );
      } else if (xhr.status === 403) {
        $error.html("⚠️ User flagged or blacklisted. Contact admin for assistance.");
      } else if (xhr.status === 401) {
        $error.html("❌ Wrong Password");
      } else {
        $error.html("⚠️ Authorization error or server issue.");
      }
    },
  });
});

/**
 * 🕒 Display live countdown and disable the login button during lockout
 */
function startLockoutCountdown(lockedUntil, $btn, $error) {
  $btn.prop("disabled", true).addClass("disabled");
  $btn.text("Locked");

  function updateCountdown() {
    const now = new Date();
    const diffMs = lockedUntil - now;

    if (diffMs <= 0) {
      clearInterval(timer);
      $btn.prop("disabled", false).removeClass("disabled").text("Login");
      $error.html("✅ You can now try logging in again.");
      return;
    }

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000)
      .toString()
      .padStart(2, "0");

    $error.html(`⏳ Account locked. Try again in <b>${minutes}:${seconds}</b>`);
  }

  updateCountdown(); // run immediately
  const timer = setInterval(updateCountdown, 1000);
}




      document.getElementById("togglePassword").addEventListener("click", function () {
        const passwordInput = document.getElementById("log_pword");
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Toggle eye and eye-slash icons
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");

        // Optional: Color feedback on toggle
        this.style.color = type === "text" ? "#007bff" : "#6c757d";
      });
