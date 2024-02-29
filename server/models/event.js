const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let eventSchema = new Schema ({
    title:{type:String},
    creator:{type:String},
    creatorId:{type:String},
    startDate:{type: Date},
    endDate:{type: Date},
    description: {type: String},
    location:{type: String},
    attendees: {type: Number},
    tickets: {type: Number},
    joinDeadline: {type: Date}, 
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