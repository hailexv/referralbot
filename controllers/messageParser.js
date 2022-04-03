const strings = require('./strings');
const bot = require('./telegramBot');
const keyboards = require('./keyboards');

const botCommandStart = async (message) => {

    if (!message.entities) {
        return false;
    }
    if (!message.entities[0]) {
        return false;
    }
    if (message.entities[0].type === 'bot_command') {
        if (message.text.substring(0, 6) === "/start" ) {
            return true;
        }
    }


    return false;
};

const replyMarkup = async (message) => {


    const adminMenuOptions = Object.keys(strings().adminMenuOptions).map(
        key => strings().adminMenuOptions[key]
    );
    
   
    return adminMenuOptions.indexOf(message.text) > -1;
}

module.exports = {
    botCommandStart,
    replyMarkup
};