const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    id: Number,
    input_state: String,
    invitationScore: {
        type: Number,
        default: 0
    },
    invitedBy: Number,
    firstName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});




module.exports = mongoose.model('User', UserSchema);