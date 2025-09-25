$("#btnLogin").click(function(e){
  let AUTH_BACKEND_URL = 'https://www.tmxgoldcoin.co';
  //let AUTH_BACKEND_URL="http://192.241.145.15:3030"
  //let AUTH_BACKEND_URL = 'http://localhost:3030';
  e.preventDefault()
  function refreshLogin(){
    $("#log_email").val('')
    $("#log_pword").val('')
  }
  let email = document.getElementById('log_email').value
  let password = document.getElementById('log_pword').value

  if(email === '') {
    $("#login_placement_error").html('*Email is required')
    return
  }
  if(password === '') {
    $("#login_placement_error").html('*Password is required')
    return
  }
  $.ajax({
    url: `${AUTH_BACKEND_URL}/api/user/login`,
    dataType: "JSON",
    contentType: "application/json",
    method: "POST",
    data: JSON.stringify({
      'user_name': email,
      'password' : password
    }),
    error: (err) => {
      refreshLogin();
      if(err.status === 401) {
        //alert(err.message);
        $("#login_placement_error").html('Wrong Password');
      }
      else if (err.status === 403){
        $("#login_placement_error").html('user flagged and blacklisted contact admin for asistance');
      }
      else{
        $("#login_placement_error").html('Authorization error');
      }
    },
    success: function (results) {
      if (results.success = true   || results.status === 201  || results.status === 200){
        localStorage.setItem('tmx_gold_name' , email);
        localStorage.setItem('user_id', results.meta.id);

        /** var sess = getSession();
        if(sess){
        console.log(sess);
        alert(sess);
        localStorage.setItem('expires', sess);
      } **/

        var request = {};
        //r token = localStorage.getItem('auth_token_agroAfric');
        var user_name = localStorage.getItem('tmx_gold_name');
        //alert(results.meta.user_roles);
        console.log(results.meta.user_roles);
        var user_roles = results.meta.user_roles;
        //alert(user_roles);
        localStorage.setItem('role', user_roles)
        if(typeof user_name === 'undefined' || user_name === null || !user_name){
          localStorage.setItem('tmx_gold_name',email)

          //user_name = email;
          localStorage.setItem('user_id', results.meta.id)

          //localStorage.setItem('token',results.data[0].token)

        }
        /** if (typeof token === 'undefined' || token === null || !token){
          request.email = email;
          console.log(request);
          const refreshJWT =   updateJWT(request);
          console.log(refreshJWT);
        } */

        //alert(refreshJWT);
        refreshLogin();
        //var usertype =
        //window.location.href = "complete_profile.html" //"https://agro-africa.io/tmxGold/v1/user/profile/:id/complete_profile.html";
        //window.location.href = 'http://localhost:8787/tmxGold/v1/user/'+localStorage.getItem('role')+'/profile/'+localStorage.getItem('user_id') + '/';
        //window.location.href = `${AUTH_BACKEND_URL}/api/user/${localStorage.getItem('role')}/profile/${localStorage.getItem('user_id')}`;
        window.location.href = `/${localStorage.getItem('role')}/profile/${localStorage.getItem('user_id')}`;
      }
      else if (results.status === 401 || results.message === 'wrongPassword'){
        //alert("here");
        $("#login_placement_error").html('Wrong Password');
        refreshLogin();
        window.location.href = "/";
      }
      else{
        $("#login_placement_error").html(results.status);
        refreshLogin();
        window.location.href = "/";
      }
    }
  })
})
