const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Association table schema
let associationSchema = new Schema ({
    name:{type:String},                         //Name of the association
    description: {type: String},                
    paymentDate:{type: Date},                   //Deadline before which each member has to pay 
    price:{type: Number},                       //Price of the membership
    associationImage:[{                         //Link to the association's image
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Image'
      }],
    event: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event'
    }],
    link: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'link'
    }],
    notification: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notification'
    }]
});

module.exports = mongoose.model("association", associationSchema);