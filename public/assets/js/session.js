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
document.getElementById("paystackButton").addEventListener("click", function () {
  let email = document.getElementById("paystackEmail").value;
  let amount = document.getElementById("paystackAmount").value * 100; // Paystack uses kobo (100 = ₦1)

  var handler = PaystackPop.setup({
    key: 'pk_test_94994e32425f874c0cb5fca19f30fa031571925f', // Your PUBLIC KEY
    email: email,
    amount: amount,
    currency: "KES", // Paystack default is NGN
    ref: ''+Math.floor((Math.random() * 1000000000) + 1), // Unique transaction ref
    callback: function(response){
        // SUCCESS: Verify on backend
        fetch("/verify-paystack-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reference: response.reference })
        })
        .then(res => res.json())
        .then(data => {
          if(data.status === "success") {
            alert("Payment successful! Crypto will be sent to your wallet.");
          } else {
            alert("Payment verification failed.");
          }
        });
    },
    onClose: function(){
        alert('Transaction was not completed, window closed.');
    }
  });
  handler.openIframe();
});