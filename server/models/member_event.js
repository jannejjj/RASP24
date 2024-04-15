const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let member_eventSchema = new Schema ({
    date:{type: Date}, // Date of ticket order
    member:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }],
    
});

module.exports = mongoose.model("member_event", member_eventSchema);