/**
 * Panthi Clinic - Database Configuration
 * 
 * Configures and initializes connection to MongoDB Atlas using Mongoose.
 * Features a resilient fallback configuration: if the MONGODB_URI is not set
 * or contains default placeholders, the server displays a clear warning instead of crashing.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    // Checks for empty URI or default placeholder strings
    if (!uri || uri.includes('<username>') || uri.includes('example.com')) {
        console.warn(`\n======================================================`);
        console.warn(`⚠️  WARNING: MongoDB Atlas URI is not configured yet!`);
        console.warn(`📝 Action: Edit the '.env' file in your project root`);
        console.warn(`   and set your 'MONGODB_URI' connection string.`);
        console.warn(`⚙️  Running in: OFFLINE MOCK MODE (Operations will log to terminal)`);
        console.warn(`======================================================\n`);
        return false;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`\n======================================================`);
        console.log(`🟢 MongoDB Atlas Connected Successfully!`);
        console.log(`🔌 Host: ${conn.connection.host}`);
        console.log(`📂 DB:   ${conn.connection.name}`);
        console.log(`======================================================\n`);
        return true;
    } catch (err) {
        console.error(`\n======================================================`);
        console.error(`🔴 MongoDB Connection Error!`);
        console.error(`💥 Message: ${err.message}`);
        console.error(`⚙️  Running in: OFFLINE MOCK MODE (Check Atlas firewall IP access)`);
        console.error(`======================================================\n`);
        return false;
    }
};

module.exports = connectDB;
