const bcrypt = require('bcryptjs');

const saltRounds = 10;

const userModel = require('../models/users');
const {successResponse, errorResponse} = require('../lib/response');
const { validateUserRegister, validateUserToken, validateUserRole, validateUserPermission,   validateAuth, validateSeller } = require('../validators/users');
const { validateId} = require('../validators/common');
const { RegisterMail, VerifyMail, ResetPasswordMail, PasswordResetMail } = require('../mails');
const sendEmail = require('../helpers/sendMail');
//const nodemailer = require('nodemailer');

const logStruct = (func, error) => {
  return {'func': func, 'file': 'userController', error}
}



  function generateExpiringOTP(length = 6) {
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10); // Generates a digit from 0-9
        }
        const now = new Date();
        const expirySeconds = 30 * 60; // OTP expires in 5 minutes
        const timeNow = Math.floor(Date.now() / 1000);
        const expirationTime = timeNow + expirySeconds;//new Date(now.getTime() + expiryMinutes * 60 * 1000); // Add minutes in milliseconds
        return {otp, expirationTime};
    }

const createUser = async (reqData) => {
  try {
    const validInput = validateUserRegister(reqData);
    const userExists = await userModel.getUserDetailsByEmail(validInput.email);
    if (userExists && userExists.length) {
      return errorResponse(403, 'userExists');
    }
    validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);
    const resp = await userModel.createUser(validInput);
    await userModel.createPermission({user_id: resp[0], role_id: reqData.role_id});
    const response = await userModel.fetchUserName(resp[0]);
    let token_data = {};
    token_data.user_name = validInput.email;
    token_data.password = resp[0];
    let eml = token_data.user_name;
    const new_token = await userModel.genToken(token_data);
    await userModel.createUserToken(new_token);
    let link = `https://www.tmxgoldcoin.co/api/user/verify/${eml}/${new_token.token}`;//"www.tmxgoldcoin.co";
    let {otp, expirationTime} = generateExpiringOTP();
    let data = {};
    data.email = validInput.email;
    data.otp = otp;
    data.expiry = expirationTime;
    data.used = 0;
    await userModel.createEmailOTP(data);
    try {
      //await sendEmail(validInput.email, RegisterMail(validInput.name, link));
      await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
    } catch (error) {
      console.log(error);
    } 
    return successResponse(201, response, { user_roles: ['customer'], email: validInput.email}, 'userRegistered')
  } catch (error) {
    console.error('error -> ', logStruct('createUser', error))
    return errorResponse(error.status, error.message);
  }
};

const updatePassword = async (reqData) => {
  try {
    let _email;
    const emailExists = await userModel.fetchEmailOTP(reqData.otp);
     if (emailExists && emailExists.length) {
       _email = emailExists[0].email;
     }
      else{
    return errorResponse(400, 'otpNotSent');
  }
    const userExists = await userModel.getUserDetailsByEmail(_email);
    if (userExists && userExists.length) {
      reqData.email = _email;
      reqData.password = bcrypt.hashSync(String(reqData.password), saltRounds);
      const response = await userModel.updatePassword(reqData);
       try {
      await sendEmail(reqData, PasswordResetMail(reqData.email));
    } catch (error) {
      console.log(error);
    } 
     let _data = {
      message : "passwordUpdated",
      data : reqData.email
     }
      return successResponse(204, _data, 'passwordUpdated')
    }
    else{
    return errorResponse(403, 'userNotRegistered');
  }
  } catch (error) {
    console.error('error -> ', logStruct('updatePassword', error))
    return errorResponse(error.status, error.message);
  }
};

const updateProfile = async (reqData) => {
  try {
    const userExists = await userModel.getUserDetailsByEmail(reqData.email);
    if (userExists && userExists.length) {
      const response = await userModel.updateProfile(reqData);
      return successResponse(204, 'profileUpdated')
    }
    else{
    return errorResponse(403, 'userNotRegistered');
  }
  } catch (error) {
    console.error('error -> ', logStruct('updateProfile', error))
    return errorResponse(error.status, error.message);
  }

  
};

const fetchUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.getDetailsById(validInput.id);
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchUser', error))
    return errorResponse(error.status, error.message);
  }
};

const sendResetPassword = async (reqData) => {
  try {
      let user_name = await userModel.fetchUserName(reqData);
      user_name = user_name[0].name;
      let {otp, expirationTime} = generateExpiringOTP();
      let data = {};
      data.email = reqData;
      data.otp = otp;
      data.expiry = expirationTime;
      data.used = 0;
      let _data =
      {
        message : "sent",
        data : reqData
      }
      await userModel.createEmailOTP(data);
      await sendEmail(reqData, ResetPasswordMail(user_name, otp));
      return successResponse(200, _data);
      //await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
    } catch (error) {
      console.log(error);
      return errorResponse(error.status, error.message);
    } 
};

const sendResetPasswordSuccess = async (reqData) => {
  try {
      let user_name = await userModel.fetchUserName(reqData);
      user_name = user_name[0].name;
      await sendEmail(reqData, PasswordResetMail(user_name));
      return successResponse(200, user_name, "sent");
      //await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
    } catch (error) {
      console.log(error);
      return errorResponse(error.status, error.message);
    } 
};

const createUserPermission = async (reqData) => {
  try {
    const validInput = validateUserPermission(reqData);
    const response = await userModel.createPermission(validInput);
    return successResponse(201, response)
  } catch (error) {
    console.error('error -> ', logStruct('createUserPermission', error))
    return errorResponse(error.status, error.message);
  }
};

const createUserRole = async (reqData) => {
  try {
    const validInput = validateUserRole(reqData);
    const response = await userModel.createUserRole(validInput);
    return successResponse(201, response)
  } catch (error) {
    console.error('error -> ', logStruct('createUserRole', error))
    return errorResponse(error.status, error.message);
  }
};


const activateUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.activeUser(validInput.id);
    return successResponse(204, 'activated')
  } catch (error) {
    console.error('error -> ', logStruct('activateUser', error))
    return errorResponse(error.status, error.message);
  }
};

const deActivateUser = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.deActiveUser(validInput.id);
    return successResponse(204, 'flagged')
  } catch (error) {
    console.error('error -> ', logStruct('deActivateUser', error))
    return errorResponse(error.status, error.message);
  }
};

const verifySeller = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.verifySeller(validInput.id);
    return successResponse(204, 'verified')
  } catch (error) {
    console.error('error -> ', logStruct('verifySeller', error))
    return errorResponse(error.status, error.message);
  }
};



const verifyEmailOtp = async (reqData) => {
  try {
    let resp = {}
    const response = await userModel.verifyEmailOTP(reqData);
    resp.message = "verified";
    resp.data = response;
    return successResponse(204, resp, 'verified');
  } catch (error) {
    console.error('error -> ', logStruct('verifyEmailOtp', error))
    return errorResponse(400, error.message);
  }
};


const activateSeller = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.activeSeller(validInput.id);
    return successResponse(204, 'activated')
  } catch (error) {
    console.error('error -> ', logStruct('activateSeller', error))
    return errorResponse(error.status, error.message);
  }
};

const deActivateSeller = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.deActiveSeller(validInput.id);
    return successResponse(204, 'flagged')
  } catch (error) {
    console.error('error -> ', logStruct('deActivateSeller', error))
    return errorResponse(error.status, error.message);
  }
};

const fetchAllUsers = async () => {
  try {
    //const validInput = validateId(reqData);
    const response = await userModel.getAllUsers();
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllUsers', error))
    return errorResponse(error.status, error.message);
  }
};

const loginUser = async (reqData) => {
  try {
    const validInput = validateAuth(reqData);
    const response = await userModel.getUserDetailsByNameOrEmail(validInput.user_name);
    const matched = bcrypt.compareSync(String(validInput.password), response[0].password);
    const isFlagged = await userModel.isUserIdFlagged(response[0].id);
    console.log(isFlagged[0].flag)
    if (!matched) {
      return errorResponse(401, 'wrongPassword');
    } 
    if (isFlagged[0].flag == 0){
      return errorResponse(403, 'user flagged contact admin for asistance');
    }
    await userModel.updateVerToken(response[0].email);
    const role_response = await userModel.getUserPermission(response[0].id);
    const user_id = response[0].id;
    const user_roles = role_response.map(el => el.role);
    const p = successResponse(200, response, {user_roles, email: response[0].email});
    return successResponse(200, response, {user_roles, email: response[0].email, id : user_id});
  } catch (error) {
    console.error('error -> ', logStruct('fetchUser', error))
    return errorResponse(error.status, error.message);
  }
};

const fetchAllCustomers = async () => {
  try {
    //const validInput = validateId(reqData);
    const response = await userModel.getAllCustomers();
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllCustomers', error))
    return errorResponse(error.status, error.message);
  }
};

const createSeller = async (reqData) => {
  try {
    const validInput = validateSeller(reqData);
    const userExists = await userModel.getUserDetailsByEmail(validInput.email);

    if (!userExists || !userExists.length) {
      validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);
      newUser = await userModel.createUser(validInput);
      validInput.user_id = newUser[0]
    } else {
      sellerExists = await userModel.getSellerDetailsByUserId(userExists[0].id);
      if (sellerExists && sellerExists.length) {
        return errorResponse(400, 'existingSeller');
      }
      validInput.user_id = userExists[0].id;
    }

    const response = await userModel.createSeller(validInput);
    return successResponse(201, response, null, 'created')
  } catch (error) {
    console.error('error -> ', logStruct('createSeller', error))
    return errorResponse(error.status, error.message);
  }
};
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
};

const updateSeller = async (reqData) => {
  try {
    //const validInput = validateSeller(reqData);
    const userExists = await userModel.getUserDetailsByEmail(reqData.email);
    if (userExists && userExists.length) {
      const response = await userModel.updateSeller(reqData);
      return successResponse(204, 'sellerUpdated')
    }
    else{
    return errorResponse(403, 'userNotRegistered');
  }
  } catch (error) {
    console.error('error -> ', logStruct('updateSeller', error))
    return errorResponse(error.status, error.message);
  }
}

const fetchSeller = async (reqData) => {
  try {
    const validInput = validateId(reqData);
    const response = await userModel.getSellerDetailsByUserId(validInput.id);
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchSeller', error))
    return errorResponse(error.status, error.message);
  }
};


const fetchAllSellers = async () => {
  try {
    //const validInput = validateId(reqData);
    const response = await userModel.getAllSellers();
    return successResponse(200, response)
  } catch (error) {
    console.error('error -> ', logStruct('fetchAllSellers', error))
    return errorResponse(error.status, error.message);
  }
};



const createToken = async(reqData) => {
  try {
       const token =  await userModel.genToken(reqData);
       const response = await userModel.createUserToken(token);
    return successResponse(201, response, 'token created');
} catch (error) {
  console.error('error -> ', logStruct('createToken', error))
  return errorResponse(error.status, error.message);
  }
};

const updateToken = async(reqData) => {
  try {
      const tknDetails = {};
      var token = await userModel.updateToken(reqData);
      //const validateToken = validateUserToken(token);
      tknDetails.token = token.token;
      tknDetails.message = token.message;
      tknDetails.expiry = token.expiry;
      if (tknDetails.message === 'updated'){
      const response = await userModel.createUserToken(tknDetails);
      return successResponse(201, response, 'token updated');
    }
    else{
      return successResponse(202, tknDetails , 'token valid');
    }
} catch (error) {
  console.error('error -> ', logStruct('updateToken', error))
  return errorResponse(error.status, error.message);
  }
};




module.exports = {
  createUser,
  updatePassword,
  updateProfile,
  fetchUser,
  sendResetPassword,
  sendResetPasswordSuccess,
  createUserPermission,
  createUserRole,
  activateUser,
  deActivateUser,
  verifySeller,
  verifyEmailOtp,
  activateSeller,
  deActivateSeller,
  fetchAllUsers,
  loginUser,
  fetchAllCustomers,
  createSeller,
  updateSeller,
  fetchSeller,
  fetchAllSellers,
  createToken,
  updateToken
}
