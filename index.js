require("dotenv").config();
const express = require("express");

// Connect DB
require("./v1/configs/mongoDB");

// Init expess
const app = express();

// Middlewares
app.use(express.json());

// authorise CROS

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Start V1

// Routes Folder

/** CPU Routes */
const CPUauth = require("./v1/routes/cpu/auth");
const CPUsteps = require("./v1/routes/cpu/steps");
/** End CPU Routes */

/** TPE Routes */
const TPEauth = require("./v1/routes/tpe/auth");
const TPEsteps = require("./v1/routes/tpe/steps");
const TPEfinance = require("./v1/routes/tpe/finance");
const TPEadministration = require("./v1/routes/tpe/administration");
const leave_balance = require("./v1/routes/tpe/leave_balance");
const leave_request = require("./v1/routes/tpe/leave_request");
const Depenses  = require('./v1/routes/depenses');
/** End TPE Routes */

const users = require("./v1/routes/users");

// API V1
app.get("/v1/health", (req, res) =>
  res.status(200).json({ status: process.env.HEALTH })
);
/** CPU Routes */
app.use("/v1/api/cpu/auth", CPUauth);
app.use("/v1/api/cpu/steps", CPUsteps);
/** End CPU Routes */
/** TPE Routes */
app.use("/v1/api/tpe/auth", TPEauth);
app.use("/v1/api/tpe/steps", TPEsteps);
app.use("/v1/api/tpe/finance", TPEfinance);
app.use("/v1/api/tpe/administration", TPEadministration);
app.use("/v1/api/leave_balance", leave_balance);
app.use("/v1/api/leave_request", leave_request);
app.use('/v1/api/depenses', Depenses);
/** End TPE Routes */

app.use("/v1/api/users", users);
// End V1

app.get("*", function (req, res) {
  res.status(404).send({ error: "Not found" });
});

// Start Server
const port = process.env.PORT || 9101;
app.listen(port);
console.log(`server listening on ${port}`);
