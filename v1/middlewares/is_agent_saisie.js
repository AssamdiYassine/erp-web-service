const User = require("../../models/user");

module.exports = (req, res, next) => {
  if (req.user.role !== "agent_saisie")
    return res.status(403).send("Access denied.");
  next();
};
