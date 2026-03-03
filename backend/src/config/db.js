import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('╔════════════════════════════════════╗');
    console.log('║  ✅ MongoDB Connected Successfully  ║');
    console.log('╠════════════════════════════════════╣');
    console.log(`║  📍 Host: ${conn.connection.host.padEnd(23)} ║`);
    console.log(`║  📦 Database: ${conn.connection.name.padEnd(19)} ║`);
    console.log(`║  🔌 Port: ${conn.connection.port.toString().padEnd(23)} ║`);
    console.log('╚════════════════════════════════════╝');
  } catch (error) {
    console.error('╔════════════════════════════════════╗');
    console.error('║  ❌ MongoDB Connection Failed       ║');
    console.error('╚════════════════════════════════════╝');
    console.error(`Error: ${error.message}`);
    console.error('\n💡 Troubleshooting Tips:');
    console.error('1. Check if MongoDB service is running');
    console.error('2. Verify connection string in .env');
    console.error('3. Run: net start MongoDB (Windows)');
    console.error('4. Or: mongod --dbpath="C:\\data\\db"\n');
    process.exit(1);
  }
};

export default connectDB;