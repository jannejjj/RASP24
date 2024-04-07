const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let newsPostSchema = new Schema ({
    title:{type:String},
    creator:{type:String},
    creatorId:{type:String},
    lastedited: {type: Date, default: Date.now},
    text: {type: String}
});

module.exports = mongoose.model("newsPost", newsPostSchema);