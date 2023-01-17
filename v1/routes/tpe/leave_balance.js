// require("../configs/passport");
const express = require("express");
const passport = require("passport");
const router = express.Router();
const passportJWT = passport.authenticate("jwt", { session: false });
const validateObjectId = require("../../middlewares/validateObjectId");

// Controllers
const leaveBalanceController = require("../../controllers/tpe/leave_balance");

// Routers
router.post("/create",passportJWT, leaveBalanceController.create);
router.get("/getAll",passportJWT, leaveBalanceController.getAll);
router.get("/getbyid/:id",passportJWT, validateObjectId, leaveBalanceController.getById);
router.put("/update/:id",passportJWT, validateObjectId, leaveBalanceController.update);
router.put("/archive/:id",passportJWT, validateObjectId, leaveBalanceController.archive);

module.exports = router;
