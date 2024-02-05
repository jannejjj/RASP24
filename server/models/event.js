const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let eventSchema = new Schema ({
    name:{type:String},
    description: {type: String},
    startDate:{type: Date},
    endDate:{type: Date},
    description: {type: String},
    place:{type: String},
    logo:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }],
    price: {type: Number},
    paymentDate:{type: Date},
    link: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'link'
    }],
    notification: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notification'
    }]
});

module.exports = mongoose.model("event", eventSchema);