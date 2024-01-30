var express = require('express');
var router = express.Router();
const controller = require("./controller");

//finds all the members in the DB
router.get("/members", controller.getMembers);

// Create new member (To be changed to registration)
router.post('/newmember', controller.addMember);

module.exports = router;