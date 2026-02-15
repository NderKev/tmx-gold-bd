$(document).ready(function(){
  let AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
  function refresh(){
    $("#username").val('')
    $("#email").val('')
    $("#phone").val('')
    $("#password").val('')
    $("#c_password").val('')

  }

  function checkPassword() {
    let password = $("#password").val();
    let confirmpassword = $("#c_password").val();
    if (password === ''){
      $("#placement_error").html('Please enter Password');
    }
    else if (confirmpassword === ''){
      $("#placement_error").html('Please enter confirm password')
    }
    else if (confirmpassword.length > 7 && confirmpassword != password) {
      $("#placement_error").html('Password did not match: Please try again...');
      return false;
    }
    else if (password.length < 8 || confirmpassword.length < 8){
      $("#placement_error").html('passsword must be 8 or more characters');
      return false;
    }

    else{
      $("#placement_error").html('password matched');
      return true;
    }
  }

  $("#c_password").keyup(checkPassword);

   
  var input = document.querySelector("#phone");
        window.intlTelInput(input, {
          initialCountry: "ke",
          // geoIpLookup: function (callback) {
          //   $.get(
          //     "https://ipinfo.io?token=<YOUR_TOKEN>",
          //     function () {},
          //     "jsonp"
          //   ).always(function (resp) {
          //     var countryCode = resp && resp.country ? resp.country : "us";
          //     callback(countryCode);
          //   });
          // },
          utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js", // for formatting
        });
 

  /**("#msg_validate").on("submit", function (e) {
        e.preventDefault();
     

      });**/

/**const input = document.querySelector("#phone");
const errorMsg = document.querySelector("#error-msg");
const validMsg = document.querySelector("#valid-msg");

// here, the index maps to the error code returned from getValidationError - see readme
const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

// initialise plugin
const iti = window.intlTelInput(input, {
	utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
});

const reset = () => {
	input.classList.remove("error");
	errorMsg.innerHTML = "";
	errorMsg.classList.add("hide");
	validMsg.classList.add("hide");
};

// on blur: validate
input.addEventListener('blur', () => {
	reset();
	if (input.value.trim()) {
		if (iti.isValidNumber()) {
			validMsg.classList.remove("hide");
		} else {
			input.classList.add("error");
			const errorCode = iti.getValidationError();
			errorMsg.innerHTML = errorMap[errorCode];
			errorMsg.classList.remove("hide");
		}
	}
});

// on keyup / change flag: reset
input.addEventListener('change', reset);
input.addEventListener('keyup', reset); **/

  /** $(window).on('load', function(e){
   e.preventDefault()
  var isLoggedIn = localStorage.getItem("tmx_gold_name");
  if (isLoggedIn){
  var UserName = localStorage.getItem("tmx_gold_name");
  $("#name").text(UserName)
  //  window.location.href = 'kidney_beans.html?id='+localStorage.getItem('user_id');///https://agro-africa.io//agroAfrica/v1/user/data/profile/" + //localStorage.getItem('user_id') + "complete_profile.html";
      window.location.href = '/tmxGold/v1/user/'+localStorage.getItem('role')+'/profile/'+localStorage.getItem('user_id') + '/';
  }
}) **/

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

$("#btnRegister").click(function (e) {
  e.preventDefault();

  const AUTH_BACKEND_URL = "http://localhost:7000"//"https://tmxgoldcoin.co"; // or your local URL
  const $error = $("#placement_error");

  function refresh() {
    $("#email").val("");
    $("#password").val("");
    $("#phone").val("");
  }

  // 🌍 Get phone number from intlTelInput
  const iti = window.intlTelInputGlobals.getInstance(document.querySelector("#phone"));
  const fullNumber = iti.getNumber(); // e.g. +254721356245

  // 🧠 Collect form data
  const email = $("#email").val().trim();
  const password = $("#password").val().trim();
  const username = email ? email.split("@")[0] : "";
  const role_id = 2;

  if (email === "") {
    $error.html("*Email is required");
    return;
  }

  // 🍪 Get affiliate ID from cookie (if any)
  const affiliateId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("affiliate_id="))
    ?.split("=")[1];

  // 📡 Send signup request — only ONE AJAX call
  $.ajax({
    url: `${AUTH_BACKEND_URL}/api/user/register${affiliateId ? `?affiliate-id=${affiliateId}` : ""}`,
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    cache: false,
    data: JSON.stringify({
      email: email,
      name: username,
      phone: fullNumber,
      password: password,
      role_id: role_id,
    }),

    success: function (results) {
      $error.html(""); // clear previous messages

      if (results.status === 201 && results.message === "userRegistered") {
        $error.html("✅ User successfully registered");
        localStorage.setItem("tmx_gold_name", email);
        refresh();
        window.location.href = "/ui-enter-otp.html";
      } else if (results.status === 403 && results.message === "userExists") {
        $error.html("⚠️ User already exists");
        refresh();
        window.location.href = "/index.html";
      } else {
        $error.html(`⚠️ ${results.message || "Unexpected response"}`);
        localStorage.setItem("tmx_gold_name", email);
        refresh();
      }
    },

    error: function (err) {
      refresh();
      if (err.status === 401) {
        $error.html("❌ Error encountered, kindly try again.");
      } else if (err.status === 403) {
        $error.html("⚠️ User already exists.");
      } else {
        $error.html(`⚠️ ${err.responseJSON?.message || err.message || "Server error"}`);
      }
    },
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


   (function() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateId = urlParams.get("affiliate-id");

    if (affiliateId) {
      // Set cookie to last 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      document.cookie = `affiliate_id=${affiliateId}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=Lax`;

      console.log("✅ Affiliate ID saved:", affiliateId);
    } else {
      // Optional: check if already stored
      const savedAffiliate = document.cookie
        .split("; ")
        .find((row) => row.startsWith("affiliate_id="))
        ?.split("=")[1];

      if (savedAffiliate) {
        console.log("ℹ️ Affiliate cookie already set:", savedAffiliate);
      }
    }
  })();


