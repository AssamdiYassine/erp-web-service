// require("../configs/passport");
const express = require("express");
const passport = require("passport");
const router = express.Router();
const passportJWT = passport.authenticate("jwt", { session: false });
const validateObjectId = require("../../middlewares/validateObjectId");

// Controllers
const leaveRequestController = require("../../controllers/tpe/leave_request");

// Routers
router.post("/create", leaveRequestController.create);
router.get("/getAll", leaveRequestController.getAll);
router.get(
  "/getbyid/:id",
  passportJWT,
  validateObjectId,
  leaveRequestController.getById
);
router.put(
  "/update/:id",
  passportJWT,
  validateObjectId,
  leaveRequestController.update
);
router.put(
  "/archive/:id",
  passportJWT,
  validateObjectId,
  leaveRequestController.archive
);

module.exports = router;
