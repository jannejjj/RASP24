var express = require('express');
var router = express.Router();
const Member = require("../models/member");
const mongoose = require("mongoose");

//finds all the members in the DB
router.get("/members", async (req, res) => {
    try {
        const members  = await Member.find({});
        res.send(members);
    } catch (err) {
        console.error(err);
        res.send("No members.");

    }
});

module.exports = router;