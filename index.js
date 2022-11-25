
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./user");
const accountRoute = require("./account");
const transactionRoute = require("./transaction");

mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);

app.use("/user", userRoute);
app.use("/account", accountRoute);
app.use("/transaction", transactionRoute);

app.listen(4001, () => {
    console.log("working...")
})
module.exports = app;
