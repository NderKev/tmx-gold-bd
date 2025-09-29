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
       //for (var order_count = 0; order_count < results.data.length; order_count++){
  			var trHTML = '';
      
          //let  crypo_items = results.data[order_count];
          $.each(results.data, function (i, crypo_items) {
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
      });
        //}
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
       //for (var fiat_count = 0; fiat_count < results.data.length; fiat_count++){
  			var trHTML = '';
      $.each(results.data, function (i, fiat_items) {
          //let  fiat_items = results.data[fiat_count];
           trHTML += '<tr><td>' + fiat_items.ref_no + '</td><td>'+fiat_items.mode+'</a></td><td>' + fiat_items.fiat + '</td><td>$' + fiat_items.status + '</td><td>' + fiat_items.amount+ '</td><td>' + fiat_items.usd  +  '</td></tr>';
         
      });
       // }
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
      // for (var tmx_count = 0; tmx_count < results.data.length; tmx_count++){
  			var trHTML = '';
      $.each(results.data, function (i, tmx_items) {
          //let  tmx_items = results.data[tmx_count];
           trHTML += '<tr><td>' + tmx_items.address + '</td><td> <a href="https://snowtrace.io/tx/' + tmx_items.tx_hash + '">'+tmx_items.tx_hash+'</a></td><td>' + tmx_items.type + '</td><td>' + tmx_items.status + '</td><td>' + tmx_items.value+ '</td><td>$' + tmx_items.usd  +  '</td></tr>';
      });
        //}
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


document.addEventListener('DOMContentLoaded', async () => {
  const role = localStorage.getItem('role');   // e.g. "admin" or "customer"

  if (role === 'customer') {
    // Option 1: completely remove the element
    document.getElementById('icoMenu').remove();
    document.getElementById('paymentMenu').remove();

    // Option 2 (alternative): just hide it
    // document.getElementById('icoMenu').style.display = 'none';
  }
  //const addr = "0xE88a92EcbAeeC20241D43A3e2512A4E705A847b8";
  connect();
  let addr = localStorage.getItem('address');
  addr = addr.toLowerCase();
  if (!addr) {
    alert('Please enter an address');
    return;
  }
  //const txs = await fetchTransactions(addr);
  //populateTable(txs);
 
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
  const latest = await provider.getBlockNumber();
  const blocksToScan = 100000; // number of latest blocks to scan
  const tbody = document.querySelector("#table-contract-transactions tbody");
  tbody.innerHTML = "Scanning...";

  let rows = "";
  for (let i = 0; i < blocksToScan; i++) {
    const blockNum = latest - i;
    const block = await provider.getBlockWithTransactions(blockNum);
    block.transactions.forEach(tx => {
      if (tx.from.toLowerCase() === addr || (tx.to && tx.to.toLowerCase() === addr)) {
        rows += `
          <tr>
            <td>${blockNum}</td>
            <td><a href="https://snowtrace.io/tx/${tx.hash}" target="_blank">${tx.hash.slice(0,12)}…</a></td>
            <td>${tx.from}</td>
            <td>${tx.to || ""}</td>
            <td>${ethers.utils.formatEther(tx.value)}</td>
          </tr>
        `;
      }
    });
  }

  tbody.innerHTML = rows || "<tr><td colspan='5'>No transactions found in last " + blocksToScan + " blocks</td></tr>";
});
const INFURA_URL = "https://avalanche-mainnet.infura.io/v3/4a66158c06d1425dab6ef27cd2a6d8aa";
const API_KEY = 'tmxgold';  // replace with your Snowtrace / Routescan key

async function fetchTransactions(address) {
  const network = 'mainnet';       // or testnet if you’re using test
  const chainId = '43114';         // Avalanche C-Chain
  const url = `https://api.routescan.io/v2/network/${network}/evm/${chainId}/address/${address}/transactions?apikey=${API_KEY}`;

  try {
    const resp = await fetch(url);
    const json = await resp.json();
    if (json.status !== "1") {
      console.error("API responded with error:", json);
      return [];
    }
    return json.result;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

function formatTimestamp(ts) {
  const d = new Date(+ts * 1000);
  return d.toLocaleString();
}

function populateTable(txList) {
  const tbody = document.querySelector('#table-contract-transactions tbody');
  tbody.innerHTML = '';  // clear previous rows

  txList.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${tx.blockNumber}</td>
      <td>${formatTimestamp(tx.timeStamp)}</td>
      <td><a href="https://snowtrace.io/tx/${tx.hash}" target="_blank">${tx.hash.slice(0, 12)}…</a></td>
      <td>${tx.from}</td>
      <td>${tx.to}</td>
      <td>${(Number(tx.value) / 1e18).toFixed(6)}</td>
      <td>${tx.gasUsed}</td>
    `;
    tbody.appendChild(tr);
  });
}

  async function connect() {
      if (!window.ethereum) return alert("Install MetaMask!");
       
      //provider = new ethers.providers.Web3Provider(window.ethereum);
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      console.log("Signer address:", signer.address);
      const account = signer.address;
      localStorage.setItem('address', account);
  }