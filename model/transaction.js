const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
    sender_id : { type: Schema.Types.ObjectId, ref: "user" },

    reciever_id: { type: Schema.Types.ObjectId, ref: "user" },
    account_id: { type: Schema.Types.ObjectId, ref: "account" },
    transaction_type: {type:String, required : true},
    amount: { type: Number },  

});


module.exports = mongoose.model("transaction", transactionSchema);