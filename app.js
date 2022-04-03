const config = require('./config');
const dotenv = require('dotenv');
const events = require('events');
const connectDB = require('./config/db');

dotenv.config();

global.eventEmitter = new events.EventEmitter();

require('./controllers/logic');

connectDB();

console.log('Bot is up and running');