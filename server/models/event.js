const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let eventSchema = new Schema ({
    title:{type:String},
    creator:{type:String},                    //Creator Name and Surname combined
    creatorId:{type:String},
    startDate:{type: Date},
    endDate:{type: Date},
    description: {type: String},
    location:{type: Object},
    attendees: {type: Number},                //Number of people that liked the event
    tickets: {type: Number},
    ticketsSold: {type: Number},
    joinDeadline: {type: Date}, 
    logo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      },
    price: {type: Number},
    paymentDate:{type: Date},
    link: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }],
  notification: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'notification'
  }]
});

module.exports = mongoose.model("event", eventSchema);