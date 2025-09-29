$(document).ready(function(){
 let AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
   var logout = document.getElementById("logout")
    var isLoggedIn = localStorage.getItem("tmx_gold_name");
    var role = localStorage.getItem("role");
    var id = localStorage.getItem("user_id");
    console.log(isLoggedIn);
    if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
        window.location.href = "/index.html";
    }
    else{
      var UserName = localStorage.getItem("tmx_gold_name");
      $("#name").text(UserName);
        $(logout).click(function(){
        localStorage.setItem('tmx_gold_name', "");
        localStorage.setItem('user_id',"");
        localStorage.setItem('role', "");
        localStorage.setItem('token', "");
      $.ajax({
            url: `${AUTH_BACKEND_URL}/api/user/logout`,
            dataType: "JSON",
            contentType: "application/json",
            method: "POST",
            data : {},
            error: (err) => {
                $("#placement_error_log").html(err.mesage);
             },
            success: function (results) {
                window.location.href = "/index.html";
            }
       })
      })
    }
      

});


document.addEventListener('DOMContentLoaded', function() {
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';

  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();

    // ✅ Clear local tokens
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');

    // ✅ Tell backend to clear cookie/session
    fetch(`${AUTH_BACKEND_URL}/api/user/logout`, {
      method: 'POST',
      credentials: 'include' // include cookies if using session/cookies
    })
    .then(() => {
      // Redirect to login or landing page
      window.location.href = '/index.html';
    })
    .catch(err => {
      console.error('Logout failed:', err);
      // Fallback redirect even if request fails
      window.location.href = '/index.html';
    });
  });
});



/* ------------------------------
            Paystack

-------------------------------
// Show Paystack fields when Paystack is selected
document.getElementById("payment_method").addEventListener("change", function () {
  const selected = this.value;
  const paystackFields = document.getElementById("paystackFields");

  if (selected === "Paystack") {
    paystackFields.style.display = "block";
  } else {
    paystackFields.style.display = "none";
  }
});


/** Paystack button handler
document.getElementById("btnBuyTokens").addEventListener("click", function () {
  const paymentMethod = document.getElementById("payment_method").value;
  if (paymentMethod !== "Paystack") {
    return;
  }

  let email = document.getElementById("paystackEmail").value;
  let amount = document.getElementById("paystackAmount").value;

  if (!email || !amount) {
    alert("Please enter both email and amount.");
    return;
  }

   if (!amount || amount < minAmountKes) {
    alert("amount must be greater than" + minAmountKes + "Kenyan Shilling");
    return;
  }

  var handler = PaystackPop.setup({
    key: 'pk_live_7bda8bdfc8d90392fde6a15590c7e470127dd2d2', // replace with the TMX public key
    email: email,
    amount: amount,
    currency: "KES",
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function (response) {
      fetch("/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: response.reference })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            alert("Payment successful! Crypto will be sent to your wallet.");
          } else {
            alert("Payment verification failed.");
          }
        })
        .catch(err => {
          console.error("Verification error:", err);
          alert("Error verifying payment.");
        });
    },
    onClose: function () {
      alert("Transaction was not completed, window closed.");
    }
  });

  handler.openIframe();
}); **/

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("settings_id")}/`,
      dataType: "JSON",
      contentType: "application/json",
      method: "GET",
      error: (err) => {
        if (err.status === 401){
        alert("Session Expired! Kindly login again");
        localStorage.setItem('tmx_gold_name', "");
        localStorage.setItem('role', "");
        localStorage.setItem('token', "");
        window.location.href = "/index.html";
      }
      },
      success: function(results){

      }
    });
  }, 1800000);