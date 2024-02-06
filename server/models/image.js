const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let imageSchema = new Schema({
    buffer: {type: Buffer},
    mimetype: {type: String},
    name: {type: String},
    encoding: {type: String}
  });

module.exports = mongoose.model("Image", imageSchema);