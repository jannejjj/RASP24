const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let memberSchema = new Schema ({
    firstname: {type: String},
    lastname: {type: String},
    phone: {type: String},
    address: {type: String},
    postalcode: {type: String},
    city: {type: String},
    country: {type: String},
    email: {type: String},
    password: {type: String},
    admin: {type: Boolean}
});

module.exports = mongoose.model("members", memberSchema);