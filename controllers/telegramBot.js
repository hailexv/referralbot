const Telegram = require('node-telegram-bot-api');

const bot = new Telegram(process.env.NODE_ENV === 'development' ? process.env.TELEGRAM_BOT_API_TEST : process.env.TELEGRAM_BOT_API, {
    polling: true,
});

module.exports = bot;