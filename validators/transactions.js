'use strict';

const {successResponse, errorResponse} = require('../lib/response');
const {validateEmail, validatePhone} = require('../lib/utilities');

exports.validateTransaction = body => {
  const bodyStruct = {};
  const arr = ['email', 'address', 'tx_hash', 'mode', 'type', 'to', 'status', 'value', 'usd']
  
   if (!validateEmail(body.email)) {
    throw errorResponse(401, 'invalidEmail');
  }

  arr.map((item) => {
    const check = body.hasOwnProperty(item);
    if (!check) throw errorResponse(400, item+'Missing');
    bodyStruct[item] = body[item];
  });
  return bodyStruct;
};
