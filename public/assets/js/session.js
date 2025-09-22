$(document).ready(function(){
 let AUTH_BACKEND_URL = 'https://www.tmxgoldcoin.co';
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

document.addEventListener("DOMContentLoaded", function () {
        const dropdown = document.getElementById("paymentMethod");
        const fields = document.querySelectorAll(".method-fields");

        function updateFields() {
            const selected = dropdown.value;
            fields.forEach(field => {
            field.style.display = (field.dataset.method === selected) ? "block" : "none";
            });
        }

        dropdown.addEventListener("change", updateFields);

        // Show default on load
        updateFields();
        });

/* ------------------------------
            Paystack

-------------------------------*/
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


// Paystack button handler
document.getElementById("btnBuyTokens").addEventListener("click", function () {
  const paymentMethod = document.getElementById("paymentMethod").value;
  if (paymentMethod !== "Paystack") {
    return;
  }

  let email = document.getElementById("paystackEmail").value;
  let amount = document.getElementById("paystackAmount").value * 100; 

  if (!email || !amount) {
    alert("Please enter both email and amount.");
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
});

