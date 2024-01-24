const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let memberSchema = new Schema ({
    username: {type: String},
    email: {type: String},
    password: {type: String},
    admin: {type: Boolean}
});

module.exports = mongoose.model("members", memberSchema);