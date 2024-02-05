const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let notificationSchema = new Schema({
    tittle: {type: String},
    message: {type: String},
    date: {type: Date}
  });

module.exports = mongoose.model("notification", notificationSchema);