const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let linkSchema = new Schema({
    name: {type: String},
    link: {type: String}
  });

module.exports = mongoose.model("link", linkSchema);