const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let member_associationSchema = new Schema ({
    date:{type: Date},        // Date of membership payment
    paid: {type: Boolean},    // If the member paid its membership or not
    member:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    association: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'association'
    }]
    
});

module.exports = mongoose.model("member_association", member_associationSchema);