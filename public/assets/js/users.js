$(document).ready(function(){
const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
let usersIndex = document.getElementById("usersIndex");
let usersTrading = document.getElementById("usersTrade")
let usersICO = document.getElementById("usersICO")
let usersUser = document.getElementById("usersUser")
let usersBuy = document.getElementById("usersBuy")
let usersGateways = document.getElementById("usersGateways")
let usersAffiliate = document.getElementById("usersAffiliate")
let usersWallet = document.getElementById("usersWallet")
let usersSecurity = document.getElementById("usersSecurity")
let usersSettings = document.getElementById("usersSettings")
let usersAccount = document.getElementById("usersAccount")
let usersFaq = document.getElementById("usersFaq")
let usersSupport = document.getElementById("usersSupport")
let accountUsers = document.getElementById("accountUsers")
let usersProfile = document.getElementById("usersProfile")
let supportUsers = document.getElementById("supportUsers")
let usersTransactions = document.getElementById("userTransactions")
//let usersUsers = document.getElementById("usersUsers")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(usersIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(usersTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(usersICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(usersUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(usersBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(usersGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(usersAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(usersWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(usersSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(usersSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(usersAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(usersFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(usersSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountUsers).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(usersProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportUsers).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(usersTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');
//$(userUsers).attr("href", '/api/'+ role +'/profile/'+ id + '/users');


 $.ajax({
            url: `${AUTH_BACKEND_URL}/api/user/customers`,
            dataType: "JSON",
            contentType: "application/json",
            method: "GET",
            error: (err) => {
                if(err.status === 401) {
                  alert("kindly login again");
                  window.location.href = "/";
                }
                else{
                  $("#placement_error_log").html(err.message);
                }
            },
            success: function(results) {
              var trHTML = '';
            if (results.data.length>0){
               //console.log("here");
               $.each(results.data, function (i, item) {
                    if (item.flag === 1 ){
                    trHTML += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.email+'</td><td>'+item.street+'</td><td>'+item.city+'</td><td>'+item.country+'</td><td class="bg-green">'+item.created_at+'</td><td><input class="btn btn-red" id="btnFlag_'+item.id+'" type="submit" value="Flag"></td></tr>';
                  }
                  else {
                    trHTML += '<tr><td>'+item.id+'</td><td>'+item.name+'</td><td>'+item.email+'</td><td>'+item.street+'</td><td>'+item.city+'</td><td>'+item.country+'</td><td class="bg-green">'+item.created_at+'</td><td><input class="btn btn-grey" id="btnActivate_'+item.id+'" type="submit" value="Activate"></td></tr>';
                   }
           })

             $('#table-admin-users').append(trHTML);
             $('.btn.btn-red').click(function(e){
             e.preventDefault();
             var id = $(this).attr('id');
             var user_id = id.replace(/[^0-9]/g,'');
             console.log(user_id);
             $.ajax({
               url: `${AUTH_BACKEND_URL}/api/user/deActivate/${user_id}`,
               dataType: "JSON",
               contentType: "application/json",
               method: "PUT",
               data: JSON.stringify({
                   'id': user_id
                 }),
               error: (err) => {
               alert("error");
                 //return false;
                 //window.location.href = '/agroAfrica/v1/user/'+localStorage.getItem('role')+'/profile/'+localStorage.getItem('user_id') + '/';
               },
               success: function(results){
                   $("#placement_error_log").html('user deactivated');
                   window.location.href="/admin_users.html";
                 }
             })
             })

             $('.btn.btn-grey').click(function(e){
             e.preventDefault();
             var id = $(this).attr('id');
             var user_id = id.replace(/[^0-9]/g,'');
             console.log(user_id);
             $.ajax({
               url: `${AUTH_BACKEND_URL}/api/user/activate/${user_id}`,
               dataType: "JSON",
               contentType: "application/json",
               method: "PUT",
               data: JSON.stringify({
                   'id': user_id
                 }),
               error: (err) => {
               alert("error");
                 //return false;
                 //window.location.href = '/agroAfrica/v1/user/'+localStorage.getItem('role')+'/profile/'+localStorage.getItem('user_id') + '/';
               },
               success: function(results){
                   $("#placement_error_log").html('user activated');
                   window.location.href="/admin_users.html";
                 }
             })
            })
          }
  }
});
}
});

setInterval(function(){
  const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
    $.ajax({
      url: `${AUTH_BACKEND_URL}/api/${localStorage.getItem("role")}/profile/${localStorage.getItem("user_id")}`,
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


document.addEventListener('DOMContentLoaded', function () {
  const role = localStorage.getItem('role');   // e.g. "admin" or "customer"

  if (role === 'customer') {
    // Option 1: completely remove the element
    document.getElementById('icoMenu').remove();
    document.getElementById('paymentMenu').remove();

    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
});
