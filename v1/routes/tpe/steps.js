require('../../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', {session: false});

// Controllers
const TPEController = require('../../controllers/tpe');

// Routers
router.get('/activation-code', passportJWT, TPEController.ActivationCode);
router.get('/resend-email-code', passportJWT,TPEController.ResendEMAILActivationCode);
router.get('/resend-sms-code', passportJWT,TPEController.ResendSMSActivationCode);
router.get('/resend-code', passportJWT,TPEController.ResendResetPasswordCode);
router.post('/identity-documents', passportJWT, TPEController.IdentityDocuments);
router.post('/get-documents', passportJWT, TPEController.getDocuments);
router.get('/verify-status', passportJWT, TPEController.VerifyStatus);


module.exports = router; 