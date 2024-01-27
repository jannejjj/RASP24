const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let member_eventSchema = new Schema ({
    date:{type: Date},
    paid: {type: Boolean},
    member:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }]
    
});

module.exports = mongoose.model("member_event", member_eventSchema);