const mongoose = require('mongoose');
const dns = require('dns');

try {
  // Use public DNS to resolve SRV records if local network blocks it
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
      console.warn('⚠️  No valid MongoDB URI found. Running in DEMO mode (no database).');
      console.warn('   Update MONGODB_URI in .env to connect to MongoDB Atlas.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will continue in DEMO mode without database.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

module.exports = connectDB;
