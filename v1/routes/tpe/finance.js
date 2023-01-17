require('../../configs/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// Controllers
const TPEController = require('../../controllers/tpe');

// Routers
router.get('/list-finance-docs', passportJWT, TPEController.getFinanceDocuments);
router.post('/add-finance-doc', passportJWT, TPEController.addFinanceDoc);
router.get('/list-transaction', passportJWT, TPEController.getTransaction);
router.get('/get-banks', passportJWT, TPEController.getBanks);
router.post('/add-bank', passportJWT, TPEController.addBank);
router.get('/get-journal', passportJWT, TPEController.getJournal);


module.exports = router; 