const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Явная обработка OPTIONS запросов ПЕРЕД всеми middleware - МАКСИМАЛЬНО ЛИБЕРАЛЬНАЯ CORS ПОЛИТИКА
app.use((req, res, next) => {
  // Устанавливаем CORS заголовки для ВСЕХ запросов (включая ошибки)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Forwarded-For');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 часа
  res.header('Access-Control-Allow-Credentials', 'false');
  
  // Обрабатываем preflight (OPTIONS) запросы НЕМЕДЛЕННО
  if (req.method === 'OPTIONS') {
    console.log('🔍 Preflight OPTIONS запрос получен:', req.path);
    res.status(204).end();
    return;
  }
  next();
});

// Middleware - Либеральная CORS политика (разрешает все источники)
app.use(cors({
  origin: '*', // Разрешаем все источники
  credentials: false, // При origin: '*' credentials должен быть false
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Дополнительная обработка OPTIONS запросов для всех путей (резервный вариант)
app.options('*', (req, res) => {
  console.log('🔍 OPTIONS запрос обработан через app.options("*"):', req.path);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Forwarded-For');
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.status(204).end();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client build
app.use(express.static('../client/dist'));

// Import models to ensure they're registered
const User = require('./models/User');
const SupportRequest = require('./models/SupportRequest');

// MongoDB connection with fallback
const connectToMongoDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
    } else {
      // Disconnect if in connecting/disconnecting state
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal-s', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected');
    }
    
    // Automatically create collections and indexes
    try {
      // Create collections if they don't exist
      const db = mongoose.connection.db;
      
      // Create users collection
      const usersExists = await db.listCollections({ name: 'users' }).hasNext();
      if (!usersExists) {
        await db.createCollection('users');
        console.log('✅ Created collection: users');
      }
      
      // Create supportrequests collection
      const supportRequestsExists = await db.listCollections({ name: 'supportrequests' }).hasNext();
      if (!supportRequestsExists) {
        await db.createCollection('supportrequests');
        console.log('✅ Created collection: supportrequests');
      }
      
      // Ensure indexes are created
      await User.ensureIndexes();
      await SupportRequest.ensureIndexes();
      console.log('✅ Indexes created/verified');
    } catch (collectionErr) {
      console.warn('⚠️  Collection/index creation warning:', collectionErr.message);
    }
    
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed, running in mock mode:', err.message);
    return false;
  }
};

// Try to connect to MongoDB, but don't fail if it's not available
connectToMongoDB();

// Routes
app.use('/api/elma', require('./routes/elma'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mock', require('./routes/mock'));

// Health check
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      mongodb: mongoStatus,
      mode: mongoStatus === 'connected' ? 'database' : 'mock'
    },
    services: {
      api: 'running',
      mock: 'available'
    }
  });
});

// Webhook endpoint for external integrations
app.post('/api/webhooks', (req, res) => {
  console.log('📨 Webhook received:', {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  
  // Process the webhook data here
  const { type, data } = req.body;
  
  // Example webhook processing
  switch (type) {
    case 'user.created':
      console.log('👤 New user created:', data);
      break;
    case 'order.updated':
      console.log('📦 Order updated:', data);
      break;
    case 'payment.completed':
      console.log('💳 Payment completed:', data);
      break;
    default:
      console.log('🔔 Unknown webhook type:', type);
  }
  
  res.json({ 
    status: 'success', 
    message: 'Webhook received',
    timestamp: new Date().toISOString()
  });
});

// Generic webhook endpoint for any external system
app.post('/api/webhooks/:system', (req, res) => {
  const system = req.params.system;
  console.log(`📨 Webhook from ${system}:`, {
    timestamp: new Date().toISOString(),
    system: system,
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  
  // Process webhook based on system
  // You can add specific logic for different external systems
  
  res.json({ 
    status: 'success', 
    message: `Webhook from ${system} received`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
