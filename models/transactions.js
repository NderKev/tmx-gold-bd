const db = require('../models/db');
const moment = require('moment');


exports.getTransactionById = async (id) => {
  const query = db.read.select('*')
  .from('transactions')
  .where('id', '=', id);
  return query;
};


exports.getTransactionByUserEmail = async (email) => {
  const query = db.read.select('*')
  .from('transactions')
  .where('email', '=', email);
  return query;
};


exports.getAllTransactions = async () => {
  const query = db.read.select('*')
  .from('transactions');

  return query;
};

exports.getTransactionsByMode = async (data) => {
  const query = db.read.select('*')
  .from('transactions')
  .where('email', '=', data.email)
  .where('mode', '=', data.mode);
  return query;
};

exports.createTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('transactions').insert({
    email: data.email,
    address: data.address,
    tx_hash: data.tx_hash,
    mode: data.mode,
    type: data.type,
    to: data.to,    
    status: data.status,
    value: data.value,
    usd: data.usd,
    created_at : createdAt,
    updated_at : createdAt
  });
  console.info("query -->", query.toQuery())
  return query;
};


exports.createFiatTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('fiat').insert({
    email: data.email,
    ref_no: data.ref_no,
    mode: data.mode,
    fiat: data.fiat,
    to: data.to,    
    status: data.status,
    amount: data.amount,
    usd: data.usd,
    created_at : createdAt,
    updated_at : createdAt
  });
  console.info("query -->", query.toQuery())
  return query;
};


exports.createTokenTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('tokens').insert({
    email: data.email,
    address: data.address,
    tx_hash: data.tx_hash,
    type: data.type,
    to: data.to,    
    status: data.status,
    value: data.value,
    usd: data.usd,
    created_at : createdAt,
    updated_at : createdAt
  });
  console.info("query -->", query.toQuery())
  return query;
};

exports.updateTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('transactions').update({
    status : data.status,
    updated_at : createdAt
  })
  .where('tx_hash', '=', data);

  console.info("query -->", query.toQuery())
  return query;
};

exports.updateFiatTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('transactions').update({
    status : data.status,
    updated_at : createdAt
  })
  .where('ref_no', '=', data);

  console.info("query -->", query.toQuery())
  return query;
};

exports.updateTokenTransaction = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('tokens').update({
    status : data.status,
    updated_at : createdAt
  })
  .where('tx_hash', '=', data);

  console.info("query -->", query.toQuery())
  return query;
};

exports.updateTransactionRef = async (data) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = db.write('transactions').update({
    status : data.status,
    updated_at : createdAt
  })
  .where('email', '=', data.email)
  .where('tx_hash', '=', data.tx_hash);
  console.info("query -->", query.toQuery())
  return query;
};
