const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ticketSchema = new Schema ({
    date:{type: Date}, // Payment Date
    member:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }],
    used: {type: Boolean}
    
});

module.exports = mongoose.model("ticket", ticketSchema);