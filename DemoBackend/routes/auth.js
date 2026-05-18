const express = require('express');
const { register, loginSession, logout, getMe, getMeJwt, logoutJwt, loginJwt } = require('../controller/authController');
const requireSession = require('../middleware/authSession');
const { requireJwt } = require('../middleware/authjwt');

const AuthRouter = express.Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', loginSession);
AuthRouter.post('/logout', logout);
AuthRouter.get('/me', requireSession, getMe);

// jwt login and logout  

AuthRouter.post('/login/jwt', loginJwt);
AuthRouter.post('/logout/jwt', logoutJwt);
AuthRouter.get('/me/jwt', requireJwt, getMeJwt)

module.exports = AuthRouter;