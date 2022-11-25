require("dotenv").config();
const express = require("express");
const Account = require("./model/account");
const Transaction = require("./model/transaction");
const auth = require("./middleware/auth");

const router = require("express").Router();
router.use(express.json());

// Deposit
router.post("/deposit", auth, async (req, res) => {
    try {
        let userAccount = await Account.findById({ _id: req.body.id });
        console.log('idd', userAccount._id)

        if (userAccount.bank_account_owner.toString() === req.user._id.toString()) {
            const transaction = await Transaction.create({
                sender_id: req.user._id,
                reciever_id: req.user._id,
                amount: req.body.amount,
                transaction_type: req.body.type,
                account_id: userAccount._id
            });

            res.status(200).json({ message: `you deposited '${req.body.amount}'in your account has been updated `, data: transaction });
        } else {
            res.status(403).json("only you can deposit in your account");
        }

    } catch (err) {
        res.status(500).json(err);
    }
});

// withdraw
router.post("/withdraw", auth, async (req, res) => {
    try {
        let userAccount = await Account.findOne({ bank_account_owner: req.user._id });
        if (userAccount && userAccount.bank_account_owner.toString() === req.user._id.toString()) {
            const transaction = await Transaction.create({
                sender_id: req.user._id,
                reciever_id: req.user._id,
                amount: req.body.amount,
                transaction_type: req.body.type,
                account_id: userAccount._id
            });

            res.status(200).json({ message: `you withdrawn  '${req.body.amount}'from your account has been successfull `, data: transaction });
        } else {
            res.status(403).json("unknown error");
        }

    } catch (err) {
        res.status(500).json(err);
    }
});

// Transfer 
router.post("/transfer", auth, async (req, res) => {
    try {
        let userAccount = await Account.findOne({ _id: req.body.account_id });
        if (userAccount.bank_account_owner.toString() != req.user._id.toString()) {
            let amountTransfer = await Transaction.create({
                sender_id: req.user._id,
                reciever_id: userAccount.bank_account_owner,
                amount: req.body.amount,
                transaction_type: req.body.type,
                account_id: userAccount._id
            });

            res.status(200).json({
                message: `you tranferred '${req.body.amount}'in the account'${userAccount.bank_account_number}'`,
                data: amountTransfer
            });
        } else {
            res.status(403).json("transfer failed");
        }

    } catch (err) {
        res.status(500).json(err);
    }
});

// get transaction details
router.get("/accounts/:id/transaction", async (req, res) => {
    try {
        const transactions = await Transaction.find({ account_id: req.params.id }).populate([
            {
                path: "sender_id reciever_id account_id",
                select: "first_name last_name email bank_account_number bank_name",
            },
        ]);
        if (!transactions) {
            return res.status(500).json("no transaction founds on this account");
        }
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;