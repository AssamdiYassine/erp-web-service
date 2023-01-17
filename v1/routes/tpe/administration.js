
require('../../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', {session: false});

// Controllers
const TPEController = require('../../controllers/tpe');

// Routers
router.post('/update-password', passportJWT, TPEController.UpdatePasswrod);
router.post('/company-documents', passportJWT, TPEController.CompanyDocs);
router.post('/collaborator-documents', passportJWT, TPEController.CollaboratorDocs);
router.get('/list-collaborators', passportJWT, TPEController.getCollaborators);


module.exports = router; 