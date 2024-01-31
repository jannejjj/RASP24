/*
const Member = require("../models/member");

const getMembers = async (req, res) => {
    try {
        const members  = await Member.find({});
        res.send(members);
    } catch (err) {
        console.error(err);
        res.send("No members.");
    }
};

const addMember = (req, res) => {
    const member = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        postalcode: req.body.postalcode,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin
    });
    member.save()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.error(err); 
        });
};



module.exports = {
    getMembers,
    addMember,
};

*/