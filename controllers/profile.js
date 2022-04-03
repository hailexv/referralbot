const keyboards = require('./keyboards');
const strings = require('./strings');
const User = require('../models/User');

const textInputCheck = async (msg, callback) => {

    const response = await User.find({id : msg.chat.id});
    const user = response[0];

    if (user) {
        callback(user.input_state, user);
    }
    else {
        callback();
    }

}

const createProfile = async (bot, msg) => {

   const user = await User.findOne({id: msg.chat.id})

   if(!user) {
    await User.create({
        id: msg.from.id,
        firstName: msg.from.first_name
    })
   } 

}

const setStatesUndefined = async (bot, msg) => {

    const user = await User.findOne({id: msg.chat.id})
    user.input_state = undefined;
    await user.save();

}

module.exports = {
    textInputCheck,
    createProfile,
    setStatesUndefined
};