const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('[DB] MONGODB_URI is not set in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`[DB] Connected to MongoDB: ${conn.connection.host} / ${conn.connection.name}`);
    } catch (err) {
        console.error(`[DB] Connection failed: ${err.message}`);
    }
};

module.exports = connectDB;
