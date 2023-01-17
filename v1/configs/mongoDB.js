const mongoose = require('mongoose');

// Connect DB
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log("Connected to DB"))
.catch(error => console.log(error));