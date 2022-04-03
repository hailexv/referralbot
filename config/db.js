const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect( process.env.NODE_ENV === 'development' ? process.env.MONGO_URI : process.env.MONGO_REMOTE_URI , {
        useNewUrlParser: true,
        useUnifiedTopology:true
    });

    console.log(`Mongodb connected: ${conn.connection.host}`);
};

module.exports = connectDB;