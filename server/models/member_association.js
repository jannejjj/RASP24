const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let member_associationSchema = new Schema ({
    date:{type: Date},
    paid: {type: Boolean},
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