const bcrypt = require('bcryptjs');
const moment = require('moment');
const saltRounds = 10;

const userModel = require('../models/users');
const affiliateModel = require('../models/affiliateModel');
const {successResponse, errorResponse} = require('../lib/response');
const { validateUserRegister, validateUserToken, validateUserRole, validateUserPermission,   validateAuth, validateSeller } = require('../validators/users');
const { validateId} = require('../validators/common');
const { RegisterMail, VerifyMail, ResetPasswordMail, PasswordResetMail, AccountLockedMail } = require('../mails');
const sendEmail = require('../helpers/sendMail');
const { assignReferralIdToUser } = require('../services/affiliateService');

const db = require('../models/db');
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

/** const createUser = async (reqData) => {
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
}; **/

const createUser = async (reqData, req, res) => {
  try {
    const validInput = validateUserRegister(reqData);
    const userExists = await userModel.getUserDetailsByEmail(validInput.email);
    if (userExists && userExists.length) {
      return errorResponse(403, 'userExists');
    }

    validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);

    // ✅ Create user
    const resp = await userModel.createUser(validInput);
    const newUserId = resp[0];

    // ✅ Assign role/permission
    await userModel.createPermission({ user_id: newUserId, role_id: reqData.role_id });

    // ✅ Fetch username
    const response = await userModel.fetchUserName(newUserId);

    // ✅ Token generation
    let token_data = {};
    token_data.user_name = validInput.email;
    token_data.password = newUserId;
    let eml = token_data.user_name;

    const new_token = await userModel.genToken(token_data);
    await userModel.createUserToken(new_token);

    // ✅ Create verification link and OTP
    let link = `https://www.tmxgoldcoin.co/api/user/verify/${eml}/${new_token.token}`;
    let { otp, expirationTime } = generateExpiringOTP();

    let data = {
      email: validInput.email,
      otp,
      expiry: expirationTime,
      used: 0
    };
    await userModel.createEmailOTP(data);

    // ✅ Send verification email
    try {
      await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
    } catch (error) {
      console.log(error);
    }

    // ✅ AFFILIATE TRACKING: handle referral link or cookie
    const affiliateIdFromCookie = req.cookies?.affiliate_id || null;
    const affiliateParam = Number(req.query['affiliate-id']) || null;
    const affiliateId = affiliateParam || (affiliateIdFromCookie ? Number(affiliateIdFromCookie) : null);

    if (affiliateId) {
      try {
        await affiliateModel.registerConversion(affiliateId, { user_id: newUserId, type: 'signup' });
        console.log(`Affiliate conversion recorded for affiliateId=${affiliateId}, user=${newUserId}`);
      } catch (err) {
        console.error('Affiliate tracking error:', err);
      }
    }
    const affiliateData = await assignReferralIdToUser(newUserId);
    console.log('Affiliate link generated for new user:', affiliateData.referral_link);
    // ✅ Final response
    return successResponse(201, response, { user_roles: ['customer'], email: validInput.email, affiliate_link: affiliateData.referral_link }, 'userRegistered');
  } catch (error) {
    console.error('error -> ', logStruct('createUser', error));
    return errorResponse(error.status, error.message);
  }
}; 

/**const createUser = async (reqData, req) => {
  try {
    const validInput = validateUserRegister(reqData);

    // Start a database transaction
    return await db.write.transaction(async (trx) => {

      // 🔍 1. Check if user already exists
      const userExists = await trx('users')
        .where({ email: validInput.email })
        .first();

      if (userExists) {
        throw errorResponse(403, 'userExists');
      }

      // 🔐 2. Hash password
      validInput.password = bcrypt.hashSync(String(validInput.password), saltRounds);

      // 👤 3. Create user
      const [newUserId] = await trx('users')
        .insert(validInput)
        .returning('id');

      // 🧩 4. Create default permission
      await trx('user_permission').insert({
        user_id: newUserId,
        role_id: reqData.role_id || 2
      });

      // 📧 5. Generate token and email OTP
      const tokenData = {
        user_name: validInput.email,
        password: newUserId,
      };

      const newToken = await userModel.genToken(tokenData);
      await trx('user_tokens').insert(newToken);

      const { otp, expirationTime } = generateExpiringOTP();

      await trx('email_otps').insert({
        email: validInput.email,
        otp: otp,
        expiry: expirationTime,
        used: 0,
      });

      // 🌐 6. Handle affiliate if applicable
      const affiliateIdFromCookie = req.cookies?.affiliate_id || null;
      const affiliateParam = Number(req.query['affiliate-id']) || null;
      const affiliateId =
        affiliateParam || (affiliateIdFromCookie ? Number(affiliateIdFromCookie) : null);

      if (affiliateId) {
        await affiliateModel.registerConversion(
          affiliateId,
          { user_id: newUserId, type: 'signup' },
          trx // ✅ use same transaction
        );
      }

      // 📤 7. Send verification email (non-blocking, outside of transaction)
      const verifyLink = `https://www.tmxgoldcoin.co/api/user/verify/${validInput.email}/${newToken.token}`;
      try {
        await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
      } catch (err) {
        console.error('Email send error:', err);
      }

      // ✅ 8. Commit and return success
      const response = await userModel.fetchUserName(newUserId);
      return successResponse(
        201,
        response,
        { user_roles: ['customer'], email: validInput.email },
        'userRegistered'
      );
    });

  } catch (error) {
    console.error('error -> ', logStruct('createUser', error));
    return errorResponse(error.status || 500, error.message || 'Server Error');
  }
}; **/


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
      await sendEmail(_email, PasswordResetMail(userExists[0].name));
    } catch (error) {
      console.log(error);
    } 
    await userModel.verifyOTPemail(reqData.otp);
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
        data : reqData,
        locked_until : new Date(Date.now() + 30 * 60 * 1000)
      }
      await userModel.createEmailOTP(data);
      await sendEmail(reqData, ResetPasswordMail(user_name, otp));
      return successResponse(200, _data);
      //await sendEmail(validInput.email, VerifyMail(validInput.name, otp));
    } catch (error) {
      console.log(error);
      return errorResponse(error.status, error.message, {locked_until : new Date(Date.now() + 30 * 60 * 1000)});
    } 
};

const sendResetPasswordSuccess = async (reqData) => {
  try {
      let user_name = await userModel.fetchUserNameEmail(reqData);
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



const verifyEmailOTP = async (reqData) => {
  try {
    const response = await userModel.verifyOTPemail(reqData);
    if (response.result === "invalid"){
       return errorResponse(400, "invalid", response);
    }
     else if (response.result === "expired"){
       return errorResponse(403, "expired", response);
    }
    else if (response.result === "error"){
       return errorResponse(404, "error", response);
    }
    else if (response.result === "verified"){
       return successResponse(204,  response, "verified");
    }
    else{
    return successResponse(200, response, 'verified');
    }
  } catch (error) {
    return errorResponse(404, "error", error.message);
  }
};


const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = await userModel.resendEmailOTP(email);
    let  username = email.split('@')[0];
    // Send the email
   await sendEmail(email, VerifyMail(username, otp));

    return res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("resendEmailOtp ->", error.message);
    return res.status(400).json({ message: error.message });
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

/** const loginUser = async (reqData) => {
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
}; **/
const loginUser = async (reqData) => {
  try {
    // ✅ Validate input
    const validInput = validateAuth(reqData);

    // ✅ Fetch user
    const user = await userModel.getUserDetailsByNameOrEmail(validInput.user_name);
    if (!user || user.length === 0) {
      return errorResponse(400, 'Invalid email or username');
    }
    const currentUser = user[0];

    // 🚫 Check if account is locked
    if (currentUser.locked_until && moment().isBefore(currentUser.locked_until)) {
      const minutesLeft = moment(currentUser.locked_until).diff(moment(), 'minutes');
      return errorResponse(403, `Account locked. Try again in ${minutesLeft} minute(s).`);
    }

    // 🔐 Verify password
    const matched = bcrypt.compareSync(String(validInput.password), currentUser.password);
    if (!matched) {
      const attempts = (currentUser.failed_attempts || 0) + 1;
      let updateData = { failed_attempts: attempts };

      // ⏳ Lock account after 3 failed attempts
      if (attempts >= 3) {
        updateData = {
          failed_attempts: 0,
          locked_until: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        };

        //if (typeof AccountLockedMail === 'function') {
           AccountLockedMail(currentUser.email, "https://www.tmxgoldcoin.co/support");
       //}
      }

      await db.write('users').where({ id: currentUser.id }).update(updateData);
      const remaining = 3 - attempts;
      return attempts >= 3
        ? errorResponse(403, 'Account locked for 30 minutes due to multiple failed attempts.')
        : errorResponse(401, `Invalid password`, {remaining_attempts: remaining});
    }

    // 🚩 Check if user is flagged
    const isFlagged = await userModel.isUserIdFlagged(currentUser.id);
    if (isFlagged && isFlagged[0]?.flag === 0) {
      return errorResponse(403, 'User flagged — contact admin for assistance.');
    }

    // ✅ Reset failed_attempts & locked_until after successful login
    await db.write('users')
      .where({ id: currentUser.id })
      .update({
        failed_attempts: 0,
        locked_until: null,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

    // 🔄 Update verification token
    await userModel.updateVerToken(currentUser.email);

    // 🧩 Fetch roles
    const role_response = await userModel.getUserPermission(currentUser.id);
    const user_roles = role_response.map((el) => el.role);

    // ✅ Return successful response
    return successResponse(200, [currentUser], {
      user_roles,
      email: currentUser.email,
      id: currentUser.id,
    });

  } catch (error) {
    console.error('error -> ', logStruct('loginUser', error));
    return errorResponse(error.status || 500, error.message || 'Login failed');
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


const getReferralLink = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.read.select('*').from('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If the user doesn’t have a referral ID yet, generate one.
    let referral_id = user.referral_id;
    if (!referral_id) {
      const assigned = await assignReferralIdToUser(user.id);
      referral_id = assigned.referral_id;
    }

    const referral_link = `https://www.tmxgoldcoin.co/?affiliate-id=${referral_id}`;

    return res.status(200).json({
      success: true,
      user_id: user.id,
      referral_id,
      referral_link,
    });
  } catch (error) {
    console.error('Error fetching referral link:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
  verifyEmailOTP,
  resendEmailOtp,
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
  updateToken,
  getReferralLink
}
