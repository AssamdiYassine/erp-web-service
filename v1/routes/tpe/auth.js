const express = require('express');
const passport = require('passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const router = express.Router();

const passportLocalSignUp = passport.authenticate('localTPESignUp', {session: false});
const passportLocalSignIn = passport.authenticate('localTPESignIn', {session: false});

const { validateBody, schemas } = require('../../helpers/routeHelpers');

require('../../configs/passport');

// Controllers
const TPEController = require('../../controllers/tpe');

// Routers
router.post('/register', validateBody(schemas.TPEsignupSchema), passportLocalSignUp, TPEController.SignUp);
router.post('/login', validateBody(schemas.TPEloginSchema), passportLocalSignIn, TPEController.SignIn);
router.post('/forgot-password', TPEController.ForgotPassword);
router.post('/password-verification-code', TPEController.PasswordVerificationCode);
router.post('/reset-password', TPEController.ResetPassword);

module.exports = router;