const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const request = require('request');


const { hashPassword, generatePassword, generateRef, generateMatricule } = require('./methods');

// Models
const User = require('../../models/user');

const { SendSMSActivationCode } = require('../controllers/tpe/auth');


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
},  async (payload, done) => {
    try { 
      // Find the user specified in token
      const user = await User.findOne({_id: payload.sub});
      // If the user doesn't exist handle it
      if (!user) {
        return done(null, {error: { code: 402, message: "" }});
      }

      // Otherwise, return the user
      done(null, user);
    } catch(error) {
      done(error, false)
    }
}));

//////////////////////////////// CPU /////////////////////////
// EMAIL SIGNUP STARTEGY
passport.use('localSignUp', new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'phone',
  passReqToCallback: true
}, async (req, phone, etc, done) => {
    try {
      
      // Check wether the current user eists in our DB
      const existingUser = await User.findOne({ phone: phone });
      
      // if not, handle it
      if (!existingUser) {
        // otherwise create user
        const password = await generatePassword(3,3,3,3);
        const ref = await generateRef();
        let hashedPassword = await hashPassword(password);
        const newUser = new User({
          phone: phone,
          password: hashedPassword,
          passUnhached: password, 
          signupStage: 10,
          ref: ref
        });
        await newUser.save();
        return done(null, newUser);
      }

      // Otherwise, return email exists
      return done(null, {error: { code: 402, message: "user already exists" }});
    } catch (error) {
      done(error, null, error.message);
    }
})); 
// EMAIL SIGNIN STARTEGY
passport.use('localSignIn', new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password'
}, async (phone, password, done) => {
    try {
      // Check wether the current user exists in our DB
      const existingUser = await User.findOne({ phone: phone });
      
      // if not, handle it
      if (!existingUser) {
        return done(null, {error: { code: 402, message: "user doesn't exist" }});
      }

      // Check if password correct
      const matchPassword = await existingUser.isValidPassword(password);
      // if not, handle it
      if (!matchPassword) {
        return done(null, {error: { code: 403, message: "wrong password" }});
      }

      // Otherwise, return the user
      return done(null, existingUser);
    } catch (error) {
      done(error, null, error.message);
    }
})); 

//////////////////////////////// TPE /////////////////////////
// EMAIL SIGNUP STARTEGY
passport.use('localTPESignUp', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
    try {
      const { phone, country } = req.body
      // Check wether the current user eists in our DB
      const existingUser = await User.findOne({ $or: [{email: email.toLowerCase()}, {phone}] });
      
      // if not, handle it
      if (!existingUser) {
        // otherwise create user
        // const password = await generatePassword(3,3,3,3);
        const ref = await generateRef();
        const matricule = await generateMatricule(null);
        let hashedPassword = await hashPassword(password);
        const newUser = new User({
          email: email.toLowerCase(),
          phone: "+"+phone,
          country: country,
          regime: "TPE",
          role: "master",
          matricule: matricule,
          password: hashedPassword,
          signupStage: 10,
          ref: ref
        });
        await newUser.save();
        await SendSMSActivationCode(newUser);

        return done(null, newUser);
      }

      // Otherwise, return email exists
      return done(null, {error: { code: 402, message: "user already exists" }});
    } catch (error) {
      done(error, null, error.message);
    }
})); 

// EMAIL SIGNIN STARTEGY
passport.use('localTPESignIn', new LocalStrategy({
  usernameField: 'credential',
  passwordField: 'password'
}, async (credential, password, done) => {
    try {
      // Check wether the current user exists in our DB
      const existingUser = await User.findOne({ $or: [{phone: credential}, {email: credential}] });
      
      // if not, handle it 
      if (!existingUser) {
        return done(null, {error: { code: 402, message: "user doesn't exist" }});
      }

      // Check if password correct
      const matchPassword = await existingUser.isValidPassword(password);
      // if not, handle it
      if (!matchPassword) {
        return done(null, {error: { code: 403, message: "wrong password" }});
      }

      // Otherwise, return the user
      return done(null, existingUser);
    } catch (error) {
      console.log(error)
      done(error, null, error.message);
    }
})); 