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
    admin: {type: Boolean},
    role: {type: String},           //String representing a role, has no influence on the behavior of the app
    membershipPaid: {type: Boolean},
    membershipPaidDate: {type: Date},
    membershipExpirationDate: {type: Date},
    profileImage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }
});

module.exports = mongoose.model("member", memberSchema);