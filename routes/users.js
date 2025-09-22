'use strict';

const express  = require('express');
const router  = express.Router();
const userController = require('../controllers/users');
const {authenticator, auth} = require('../lib/common');
const path = require('path');
const authController = require('../controllers/auth');
const url = require('url');
const checkAdmin = require('../middleware/checkAdmin');
const checkUser = require('../middleware/checkUser');

//const createAuthToken = require('../models/users');
// CRUD user
router.post('/register',  async (req, res) => {
  const response = await userController.createUser(req.body);
  
  if (response.success && response.meta) {
    req.session.email = response.meta.email;
    req.session.password = req.body.password;
    req.session.user_roles = response.meta.user_roles;
  }
   /** const regToken = await authController.generateToken(req.body);
      var packageReq = {
         token : regToken.data.token.token,
         email : regToken.data.token.email,
         user : req.body.name
       }
      await authController.sendVerification(packageReq); **/
  return res.status(response.status).send(response)
});

router.get('/fetch/:id',  async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.fetchUser(req.body)
  return res.status(response.status).send(response)
});

router.post('/updatePassword', auth, async (req, res) => {
  const response = await userController.updatePassword(req.body)
  return res.status(response.status).send(response)
})

router.post('/updateProfile', authenticator, checkUser, async (req, res) => {
  const response = await userController.updateProfile(req.body)
  return res.status(response.status).send(response)
})

router.get('/users', authenticator, checkAdmin,  async (req, res, next) => {
  const response = await userController.fetchAllUsers();
  return res.status(response.status).send(response)
})

router.post('/permission', authenticator, checkAdmin,  async (req, res) => {
  const response = await userController.createUserPermission(req.body);
  return res.status(response.status).send(response)
});

router.post('/role', authenticator, checkAdmin, async (req, res) => {
  const response = await userController.createUserRole(req.body);
  return res.status(response.status).send(response)
});

// authenticator

router.post('/createToken', authenticator, async (req, res) => {
  const response = await userController.createToken(req.body)
  return res.status(response.status).send(response)
})

router.post('/generateAuth', async (req, res) => {
  const response = await authController.generateToken(req.body);
  return res.status(response.status).send(response);
})

router.post('/sendAuth', async (req, res) => {
  const response = await authController.sendVerification(req.body);
  return res.status(response.status).send(response);
})

router.get('/verify/:email/:token', async (req, res) => {
  var token = req.params.token;
  var email = req.params.email;
  var packageToken = {
    token : token,
    email : email
  }
 await authController.verifyToken(packageToken);
  //return res.status(response.status).send(response)
  //console.log(response);

function getFormattedUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
}

res.redirect(getFormattedUrl(req));
  //res.redirect('/home');

})


router.post('/verify', async (req, res) => {
  const response = await userController.verifyEmailOtp(req.body.otp);
  return res.status(response.status).send(response);
})

router.post('/login',  async (req, res) => {
  const response = await userController.loginUser(req.body);
  if (response.success && response.meta) {
    req.session.email = response.meta.email;
    req.session.password = response.data[0].password;
    req.session.user_roles = response.meta.user_roles;
    req.session.user_id = response.data[0].id;
    req.session.user = response.data[0].name;
  }
  
  const id = req.session.user_id;
  //const user = req.session.user;
  if (req.session.user_roles.indexOf('admin') >= 0) {
        //res.status(resp onse.status).send(response)
        //res.sendFile(path.join(__dirname, '../pages' , 'add_category.html'));
        //req.session.user = user;
        //req.session.user.role = "admin";
        res.json({ redirect: `/admin/profile/${id}`, meta : response.meta, data : response.data });

  }
  else if (req.session.user_roles.indexOf('seller') >= 0) {
        res.json({ redirect: `/seller/profile/${id}`, meta : response.meta, data : response.data });
       //res.redirect(`/seller/profile/${req.session.user_id}`);
    }
  else if (req.session.user_roles.indexOf('customer') >= 0) {
       res.json({ redirect: `/customer/profile/${id}` , meta : response.meta, data : response.data});
      //res.redirect(`/customer/profile/${req.session.user_id}`);
    }
  else {
      //res.status(401).send(response);
      res.json({ redirect: `/` });
      //res.redirect('/');
    }
  //return res.status(response.status).send(response);
    //res.redirect('/profile/:id/')

});

router.post('/logout', authenticator, async (req, res) => {
  req.session.destroy(err => {
    res.clearCookie('sid')
    return res.status(200).send('loggedout');
  })
});

/** router.get('/getSession', authenticator, async (req, res) => {
  var response = await authController.getSession(req.session);
  console.log(response);
  return res.status(200).send(response);

}); **/

router.post('/seller', authenticator, async (req, res) => {
  const response = await userController.createSeller(req.body)
  return res.status(response.status).send(response)
})

router.get('/fetchSeller/:id', authenticator, allowSeller, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.fetchSeller(req.body)
  return res.status(response.status).send(response)
});

router.get('/fetchSellers', authenticator, checkAdmin, async (req, res) => {
  const response = await userController.fetchAllSellers()
  return res.status(response.status).send(response)
});

router.post('/updateSeller', authenticator, allowSeller, async (req, res) => {
  const response = await userController.updateSeller(req.body)
  return res.status(response.status).send(response)
})


/** router.post('/updateToken', async (req, res) => {
  const response = await userController.updateToken(req.body)
  return res.status(response.status).send(response)
  //res.redirect('/profile/:id/');
}) **/

router.get('/home', async (req, res) => {
  //req.body.id = Number(req.params.id);
  //const response = await userController.fetchSeller(req.body)
  res.sendFile(path.join(__dirname, '../public' , 'index.html'));
});


router.get('/admin/profile/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  //req.body.customer = req.params.
  //const response = await userController.fetchUser(req.body)
  res.sendFile(path.join(__dirname, '../public' , 'index-ico-admin.html'));
});

router.get('/admin/profile/:id/gateways', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'payment-gateways.html'));
});

router.get('/admin/profile/:id/dashboard', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  //req.body.customer = req.params.
  //const response = await userController.fetchUser(req.body)
  res.sendFile(path.join(__dirname, '../public' , 'index-dashboard.html'));
});

router.get('/admin/profile/:id/trade', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-trading-view.html'));
});


router.get('/admin/profile/:id/buy', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'buy-and-sell.html'));
});

router.get('/admin/profile/:id/affiliate', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , '/affailite-program.html'));
});

router.get('/admin/profile/:id/wallet', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'my-wallet.html'));
});


router.get('/admin/profile/:id/security', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'security.html'));
});

router.get('/admin/profile/:id/account', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'account-confirmation.html'));
});

router.get('/admin/profile/:id/settings', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'settings.html'));
});

router.get('/admin/profile/:id/faq', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-faq.html'));
});

router.get('/admmin/profile/:id/support', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-support.html'));
});

router.get('/customers', authenticator, checkAdmin,  async (req, res, next) => {
  const response = await userController.fetchAllCustomers();
  return res.status(response.status).send(response)
})

router.put('/activate/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.activateUser(req.body);
  return res.status(response.status).send(response)
})

router.put('/deActivate/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.deActivateUser(req.body);
  return res.status(response.status).send(response)
})


router.put('/verifySeller/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.verifySeller(req.body);
  return res.status(response.status).send(response)
})

router.put('/activateSeller/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.activateSeller(req.body);
  return res.status(response.status).send(response)
})

router.put('/deActivateSeller/:id', authenticator, checkAdmin, async (req, res) => {
  req.body.id = Number(req.params.id);
  const response = await userController.deActivateSeller(req.body);
  return res.status(response.status).send(response)
})

router.get('/customer/profile/:id', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  //req.body.customer = req.params.
  //const response = await userController.fetchUser(req.body)
  res.sendFile(path.join(__dirname, '../public' , 'index-dashboard.html'));
});

router.get('/customer/profile/:id/trade', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-trading-view.html'));
});

router.get('/customer/profile/:id/user', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'index-ico-user.html'));
});

router.get('/customer/profile/:id/buy', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'buy-and-sell.html'));
});

router.get('/customer/profile/:id/affiliate', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , '/affailite-program.html'));
});

router.get('/customer/profile/:id/wallet', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'my-wallet.html'));
});


router.get('/customer/profile/:id/security', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'security.html'));
});

router.get('/customer/profile/:id/account', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'account-confirmation.html'));
});

router.get('/customer/profile/:id/settings', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'settings.html'));
});

router.get('/customer/profile/:id/faq', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-faq.html'));
});

router.get('/customer/profile/:id/support', authenticator, checkUser, async (req, res) => {
  req.body.id = Number(req.params.id);
  res.sendFile(path.join(__dirname, '../public' , 'ui-support.html'));
});



/** router.get('/profile/:id/', authenticator, auth, async (req, res) => {
  req.body.id = Number(req.params.id);
  console.log(req.body.id );
  //const response = await userController.fetchUser(req.body)
  //console.log(req.session.user_roles.indexOf('customer'));
  if (req.session.user_roles.indexOf('admin') >= 0) {
        //res.status(response.status).send(response)
        res.sendFile(path.join(__dirname, '../pages' , 'add_category.html'));

  }
  else if (req.session.user_roles.indexOf('seller') >= 0) {
       //res.status(response.status).send(response)
       res.sendFile(path.join(__dirname, '../pages' , 'seller_profile.html'));
       //return res.status(response.status).send(response)
       //res.redirect('/profile/:id/seller/');
    }
  else if (req.session.user_roles.indexOf('customer') >= 0) {
      //res.status(response.status).send(response)
      res.sendFile(path.join(__dirname, '../pages' , 'profile.html'));
    }
  else {
      //res.status(401).send(response);
      return res.sendFile(path.join(__dirname, '../pages' , 'index.html'));
    }
   //return res.status(response.status).send(response);
}); **/


router.get('/public/index-ico-admin.html', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index-ico-admin.html"));
});

router.get('/public/payment-gateways.html', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/payment-gateways.html"));
});






module.exports = router;
