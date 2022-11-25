const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const accountSchema = new mongoose.Schema({
    bank_name: {type:String,required : true},
    bank_account_type: {type:String,required : true, enum: ['Saving', 'Current',]},
    bank_account_code: {type:String,required : true},
    bank_account_branch: {type:String,required : true},
    bank_account_number: {type:String,required : true},
    bank_account_owner : { type: Schema.Types.ObjectId, ref: "user" },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }


});

module.exports = mongoose.model("account", accountSchema);