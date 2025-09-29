$(document).ready(function(){
const AUTH_BACKEND_URL = 'https://tmxgoldcoin.co';
let transactionsIndex = document.getElementById("transactionsIndex");
let transactionsTrading = document.getElementById("transactionsTrade")
let transactionsICO = document.getElementById("transactionsICO")
let transactionsUser = document.getElementById("transactionsUser")
let transactionsBuy = document.getElementById("transactionsBuy")
let transactionsGateways = document.getElementById("transactionsGateways")
let transactionsAffiliate = document.getElementById("transactionsAffiliate")
let transactionsWallet = document.getElementById("transactionsWallet")
let transactionsSecurity = document.getElementById("transactionsSecurity")
let transactionsSettings = document.getElementById("transactionsSettings")
let transactionsAccount = document.getElementById("transactionsAccount")
let transactionsFaq = document.getElementById("transactionsFaq")
let transactionsSupport = document.getElementById("transactionsSupport")
let accountTransactions = document.getElementById("accountTransactions")
let transactionsProfile = document.getElementById("transactionsProfile")
let supportTransactions = document.getElementById("supportTransactions")
let transactionsTransactions = document.getElementById("transactionsTransactions")

var role = localStorage.getItem("role");
var id =  localStorage.getItem("user_id");
var isLoggedIn = localStorage.getItem("tmx_gold_name");

if (typeof isLoggedIn === 'undefined' || isLoggedIn === null || !isLoggedIn){
  window.location.href = "/index.html";
}else{
$(transactionsIndex).attr("href", '/api/'+ role +'/profile/'+ id);
$(transactionsTrading).attr("href", '/api/'+ role +'/profile/'+ id + '/trade');
$(transactionsICO).attr("href", '/api/'+ role +'/profile/'+ id + '/ico');
$(transactionsUser).attr("href", '/api/'+ role +'/profile/'+ id + '/user');
$(transactionsBuy).attr("href", '/api/'+ role +'/profile/'+ id + '/buy');
$(transactionsGateways).attr("href", '/api/'+ role +'/profile/'+ id + '/gateways');
$(transactionsAffiliate).attr("href", '/api/'+ role +'/profile/'+ id + '/affiliate');
$(transactionsWallet).attr("href", '/api/'+ role +'/profile/'+ id + '/wallet');
$(transactionsSecurity).attr("href", '/api/'+ role +'/profile/'+ id + '/security');
$(transactionsSettings).attr("href", '/api/'+ role +'/profile/'+ id + '/settings');
$(transactionsAccount).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(transactionsFaq).attr("href", '/api/'+ role +'/profile/'+ id + '/faq');
$(transactionsSupport).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(accountTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/account');
$(transactionsProfile).attr("href", '/api/'+ role +'/profile/'+ id + '/profile');
$(supportTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/support');
$(transactionsTransactions).attr("href", '/api/'+ role +'/profile/'+ id + '/transactions');


$.ajax({
  		url: `${AUTH_BACKEND_URL}/api/tx/fetch/${isLoggedIn}`,
  		dataType: "JSON",
  		contentType: "application/json",
  		method: "GET",
  		error: (err) => {
  			alert("no crypto data exists");
  		},
  		success: function(results) {
  			if (results.data.length>0){
       for (var order_count = 0; order_count < results.data.length; order_count++){
  			var trHTML = '';
      
          let  crypo_items = results.data[order_count];
    
           if(crypo_items.mode === 'eth'){
           trHTML += '<tr><td>' + crypo_items.address + '</td><td> <a href="https://etherscan.io/tx/' + crypo_items.tx_hash + '">'+crypo_items.tx_hash+'</a></td><td>'+crypo_items.mode+'</a></td><td>' + crypo_items.type + '</td><td>$' + crypo_items.status + '</td><td>' + crypo_items.value+ '</td><td>' + crypo_items.usd  +  '</td></tr>';
         }
         else if (crypo_items.mode === 'btc')
         {
           trHTML += '<tr><td>' + crypo_items.address + '</td><td> <a href="https://live.blockcypher.com/tx/' + crypo_items.tx_hash + '">'+crypo_items.tx_hash+'</a></td><td>'+crypo_items.mode+'</a></td><td>' + crypo_items.type + '</td><td>$' + crypo_items.status + '</td><td>' + crypo_items.value + '</td><td>' + crypo_items.usd  +  '</td></tr>';
         }
        else if (crypo_items.mode === 'avax')
         {
           trHTML += '<tr><td>' + crypo_items.address + '</td><td> <a href="https://snowtrace.io/tx/' + crypo_items.tx_hash + '">'+crypo_items.tx_hash+'</a></td><td>'+crypo_items.mode+'</a></td><td>' + crypo_items.type + '</td><td>$' + crypo_items.status + '</td><td>' + crypo_items.value+ '</td><td>' + crypo_items.usd  +  '</td></tr>';
         }
          else if (crypo_items.mode === 'bnb')
         {
           trHTML += '<tr><td>' + crypo_items.address + '</td><td> <a href="https://bscscan.com/tx/' + crypo_items.tx_hash + '">'+crypo_items.tx_hash+'</a></td><td>'+crypo_items.mode+'</a></td><td>' + crypo_items.type + '</td><td>$' + crypo_items.status + '</td><td>' + crypo_items.value + '</td><td>' + crypo_items.usd  +  '</td></tr>';
         }
        else 
         {
           trHTML += '<tr><td>' + crypo_items.address + '</td><td> <a href="https://etherscan.io/tx/' + crypo_items.tx_hash + '">'+crypo_items.tx_hash+'</a></td><td>'+crypo_items.mode+'</a></td><td>' + crypo_items.type + '</td><td>$' + crypo_items.status + '</td><td>' + crypo_items.value + '</td><td>' + crypo_items.usd  +  '</td></tr>';
         }
      // });
        }
        $('#table-crypo-transactions').append(trHTML);
  }
}
});


$.ajax({
  		url: `${AUTH_BACKEND_URL}/api/tx/fiat/${isLoggedIn}`,
  		dataType: "JSON",
  		contentType: "application/json",
  		method: "GET",
  		error: (err) => {
  			alert("no fiat data exists");
  		},
  		success: function(results) {
  			if (results.data.length>0){
       for (var fiat_count = 0; fiat_count < results.data.length; fiat_count++){
  			var trHTML = '';
      
          let  fiat_items = results.data[fiat_count];
           trHTML += '<tr><td>' + fiat_items.ref_no + '</td><td>'+fiat_items.mode+'</a></td><td>' + fiat_items.fiat + '</td><td>$' + fiat_items.status + '</td><td>' + fiat_items.amount+ '</td><td>' + fiat_items.usd  +  '</td></tr>';
         
      // });
        }
        $('#table-fiat-transactions').append(trHTML);
  }
}
});

$.ajax({
  		url: `${AUTH_BACKEND_URL}/api/tx/token/${isLoggedIn}`,
  		dataType: "JSON",
  		contentType: "application/json",
  		method: "GET",
  		error: (err) => {
  			alert("no token data exists");
  		},
  		success: function(results) {
  			if (results.data.length>0){
       for (var tmx_count = 0; tmx_count < results.data.length; tmx_count++){
  			var trHTML = '';
      
          let  tmx_items = results.data[tmx_count];
           trHTML += '<tr><td>' + tmx_items.address + '</td><td> <a href="https://snowtrace.io/tx/' + tmx_items.tx_hash + '">'+tmx_items.tx_hash+'</a></td><td>' + tmx_items.type + '</td><td>' + tmx_items.status + '</td><td>' + tmx_items.value+ '</td><td>$' + tmx_items.usd  +  '</td></tr>';
      // });
        }
        $('#table-tmxgold-transactions').append(trHTML);
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
