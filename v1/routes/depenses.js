require('../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', {session: false});


// Controllers
const DepensesControllers = require('../controllers/depenses');

// Routes
router.get('/list', passportJWT, DepensesControllers.List);

module.exports = router;
