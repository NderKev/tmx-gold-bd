$(document).ready(function(){
  let AUTH_BACKEND_URL = 'http://localhost:7000';
  //let AUTH_BACKEND_URL = "http://192.241.145.15:3030/"
  //let AUTH_BACKEND_URL = 'http://localhost:3030';
  function refresh(){
    $("#name").val('')
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
    let email = document.getElementById('email').value
    let name = document.getElementById('name').value
    let phone = document.getElementById('phone').value
    let password = document.getElementById('password').value
    //let role = document.getElementById('role').value
    let role_id = 1;
    if(email === '') {
      $("#placement_error").html('*Email is required')
      return
    }
    $.ajax({
      url: `${AUTH_BACKEND_URL}/tmxGold/v1/user/register`,
      dataType: "JSON",
      contentType: "application/json",
      method: "POST",
      cache : false,
      data: JSON.stringify({
        'email': email,
        'name': name,
        'phone' : phone,
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
          window.location.href = "www.tmxgoldcoin.com/register.html";
        }
        else if (results.status === 403 && results.message === 'userExists'){
          $("#placement_error").html('user exists');
          refresh();
          window.location.href = "www.tmxgoldcoin.com/index.html";
        }
        else{
          $("#placement_error").html(results.message);
          refresh();
          window.location.href = "www.tmxgoldcoin.com/register.html";
        }
      }
    }
    })
  })

})
