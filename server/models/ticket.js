const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ticketSchema = new Schema ({
    date:{type: Date},
    member:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }],
    
});

module.exports = mongoose.model("ticket", ticketSchema);