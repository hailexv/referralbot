const mongoose = require('mongoose');

const ReferralInfoSchema = new mongoose.Schema({

    isActive: {
        type: Boolean,
        default: false
    }

});




module.exports = mongoose.model('RefferalInfo', ReferralInfoSchema);