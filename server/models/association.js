const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let associationSchema = new Schema ({
    name:{type:String},
    description: {type: String},
    paymentDate:{type: Date},
    price:{type: Number},
    associationImage:[{
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