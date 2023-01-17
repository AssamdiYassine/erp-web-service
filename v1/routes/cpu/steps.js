require('../../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', {session: false});

// Controllers
const CPUController = require('../../controllers/cpu');

// Routers
router.post('/identity-documents', passportJWT, CPUController.IdentityDocuments);
router.post('/get-documents', passportJWT, CPUController.getDocuments);
router.get('/verify-status', passportJWT, CPUController.VerifyStatus);


module.exports = router;