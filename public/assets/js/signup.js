$(document).ready(function(){
  let AUTH_BACKEND_URL = 'https://www.tmxgoldcoin.co';
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
  //  window.location.href = 'kidney_beans.html?id='+localStorage.getItem('user_id');///https://agro-africa.io//agroAfrica/v1/user/profile/" + //localStorage.getItem('user_id') + "complete_profile.html";
      window.location.href = '/tmxGold/v1/user/'+localStorage.getItem('role')+'/profile/'+localStorage.getItem('user_id') + '/';
  }
}) **/

  $("#btnRegister").click(function(e){
    e.preventDefault()
   var iti = window.intlTelInputGlobals.getInstance(
          document.querySelector("#phone")
    );
   var fullNumber = iti.getNumber(); // e.g. +254721356245
   //one_nmuber = fullNumber;
    console.log("User phone:", fullNumber);
    //alert("phone number :" + fullNumber);
    let email = document.getElementById('email').value
    let name = document.getElementById('username').value
    //let phone = fullNumber;
    let password = document.getElementById('password').value
    //let role = document.getElementById('role').value
    let role_id = 1;
    if(email === '') {
      $("#placement_error").html('*Email is required')
      return
    }
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/user/register`,
      dataType: "JSON",
      contentType: "application/json",
      method: "POST",
      cache : false,
      data: JSON.stringify({
        'email': email,
        'name': name,
        'phone' : fullNumber,
        'password' : password,
        "role_id": role_id
      }),
      error: (err) => {
        //unLoadingAnimation()
        refresh();
        if(err.status === 401) {
          //alert("Error encountered, Kindly Try Again");
          $("#placement_error").html('Error encountered, Kindly Try Again');
        }
        else if (err.status === 403){
          refresh();
          $("#placement_error").html('user exists');
        }
        else {
          $("#placement_error").html(err.message);
        }
      },
      success: function (results){
        if (results.data.length>0){
        $("#placement_error").html('');
        console.log(results.message);
        if (results.status === 201 && results.message === 'userRegistered'){
          $("#placement_error").html('user successfully registered');
          refresh();
          window.location.href = "/ui-enter-otp.html";
        }
        else if (results.status === 403 && results.message === 'userExists'){
          $("#placement_error").html('user exists');
          refresh();
          window.location.href = "/index.html";
        }
        else{
          $("#placement_error").html(results.message);
          refresh();
          window.location.href = "/ui-register.html";
        }
      }
    }
    })
  })

})
