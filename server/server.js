require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Use reliable public DNS servers so Node's SRV lookups succeed in restricted networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Using public DNS servers for SRV lookups:', dns.getServers());
} catch (e) {
  console.warn('Could not set DNS servers:', e && e.message);
}
async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in environment. Aborting startup.');
    process.exit(1);
  }

  const mongooseOptions = {
    // keep server selection reasonably short so retries proceed
    serverSelectionTimeoutMS: 10000,
    // pool size to limit connections
    maxPoolSize: 10,
    tls: true,
  };

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting MongoDB Atlas connection (attempt ${attempt}/${maxRetries})...`);
      await mongoose.connect(mongoUri, mongooseOptions);
      console.log('✅ MongoDB connected successfully (Atlas)');
      return;
    } catch (err) {
      console.error(`⚠️ Atlas connection attempt ${attempt} failed:`, err.message);
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  console.error('❌ Could not connect to MongoDB Atlas after multiple attempts. Exiting to ensure data is persisted to Atlas.');
  process.exit(1);
}

async function startServer() {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }

  const app = express();

  app.use(cors());
  app.use(express.json());

  const itemRoutes = require('./routes/itemRoutes');
  const authRoutes = require('./routes/authRoutes');
  const notificationRoutes = require('./routes/notificationRoutes');

  app.get('/', (req, res) => {
    res.send('Lost and Found API is running...');
  });
  app.get('/api/test-db', (req, res) => res.json({ state: mongoose.connection.readyState }));
  app.use('/api/notifications', notificationRoutes);  
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});