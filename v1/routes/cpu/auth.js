const express = require('express');
const passport = require('passport');
const passportJWT = passport.authenticate('jwt', {session: false});

const router = express.Router();

const passportLocalSignUp = passport.authenticate('localSignUp', {session: false});
const passportLocalSignIn = passport.authenticate('localSignIn', {session: false});

const { validateBody, schemas } = require('../../helpers/routeHelpers');

require('../../configs/passport');

// Controllers
const CPUController = require('../../controllers/cpu');

// Routers
router.post('/register', validateBody(schemas.CPUsignupSchema), passportLocalSignUp, CPUController.SignUp);
router.post('/login', validateBody(schemas.CPUloginSchema), passportLocalSignIn, CPUController.SignIn);

module.exports = router;