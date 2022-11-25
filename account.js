require("dotenv").config();
const express = require("express");
const User = require("./model/user");
const Account = require("./model/account");
const auth = require("./middleware/auth");
const jwt = require('jsonwebtoken');
const router = require("express").Router();

router.use(express.json());

router.post("/account/create", auth, async (req, res) => {
    try {
        // Get user bank input
        const { bank_name, bank_account_type, bank_account_code, bank_account_branch, bank_account_number } = req.body;
        const bank_account_owner = req.user._id;

        if (!(bank_name && bank_account_type && bank_account_code && bank_account_branch && bank_account_number)) {
            res.status(400).send("All input is required");
        }

        const oldAccount = await Account.findOne({ bank_account_number });
        if (oldAccount) {
            return res.status(409).send("Account Already Exist. Please add new one");
        }

        const account = await Account.create({
            bank_name,
            bank_account_type,
            bank_account_code,
            bank_account_branch,
            bank_account_number,
            bank_account_owner
        });


        return res.status(200).json({ message: "account created", data: account });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/account/update/:id", auth, async (req, res) => {
    try {
        let account = await Account.findById(req.params.id);
        if (account.bank_account_owner.toString() === req.user._id.toString()) {
            let updatedAccount = await Account.findByIdAndUpdate({
                _id: req.params.id,
            },
                {
                    ...req.body,
                },
                {
                    new: true,
                });

            res.status(200).json({ message: "your account has been updated ", data: updatedAccount });
        } else {
            res.status(403).json("only you can update your account");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/accounts/:id", async (req, res) => {
    try {
        let accountDetails = await Account.findById({ _id: req.params.id }).populate([
            {
                path: "bank_account_owner",
                select: "first_name last_name email",
            },
        ]);
        if (!accountDetails) {
            return res.status(500).json("account  details can not founds ");
        }
        res.status(200).json(accountDetails);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/accounts", async (req, res) => {
    try {
        const accounts = await Account.find().populate([
            {
                path: "bank_account_owner",
                select: "first_name last_name email",
            },
        ]);

        if (!accounts) {
            return res.status(500).json("no accounts founds");
        }
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;