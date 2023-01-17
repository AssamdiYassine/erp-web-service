require('../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', {session: false});


// Controllers
const UsersControllers = require('../controllers/users');

// Routes
router.get('/authorized', passportJWT, UsersControllers.Autorized);
router.get('/activate/:token', UsersControllers.Validation);


module.exports = router;