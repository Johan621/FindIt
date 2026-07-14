require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      console.warn('⚠️ Atlas connection failed, starting in-memory MongoDB fallback...');
      console.warn(err.message);
    }
  }

  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('lostandfound');
  await mongoose.connect(memoryUri);
  console.log('✅ In-memory MongoDB started successfully');
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