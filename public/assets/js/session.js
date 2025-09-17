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