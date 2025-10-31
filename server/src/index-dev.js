const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from project root
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Import models to ensure they're registered
const User = require('./models/User');
const SupportRequest = require('./models/SupportRequest');

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

// MongoDB connection with fallback
const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portal-s';
    console.log('🔌 Попытка подключения к MongoDB...');
    console.log('📍 URI:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Скрываем пароль в логах
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return true;
    }
    
    // Disconnect if in connecting/disconnecting state
    if (mongoose.connection.readyState !== 0) {
      console.log('🔄 Отключение от существующего подключения...');
      await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Automatically create collections and indexes
    try {
      // Create collections if they don't exist
      const db = mongoose.connection.db;
      
      // Create users collection
      const usersExists = await db.listCollections({ name: 'users' }).hasNext();
      if (!usersExists) {
        await db.createCollection('users');
        console.log('✅ Created collection: users');
      } else {
        console.log('✅ Collection "users" already exists');
      }
      
      // Create supportrequests collection
      const supportRequestsExists = await db.listCollections({ name: 'supportrequests' }).hasNext();
      if (!supportRequestsExists) {
        await db.createCollection('supportrequests');
        console.log('✅ Created collection: supportrequests');
      } else {
        console.log('✅ Collection "supportrequests" already exists');
      }
      
      // Ensure indexes are created
      await User.ensureIndexes();
      await SupportRequest.ensureIndexes();
      console.log('✅ Indexes created/verified');
    } catch (collectionErr) {
      console.warn('⚠️  Collection/index creation warning:', collectionErr.message);
      console.error('📊 Collection error details:', collectionErr);
    }
    
    // Добавляем обработчики событий подключения
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('📊 Connection error details:', {
      name: err.name,
      code: err.code,
      errorLabels: err.errorLabels
    });
    console.warn('⚠️  Running in mock mode - database operations will be disabled');
    return false;
  }
};

// Try to connect to MongoDB, but don't fail if it's not available
connectToMongoDB().then((connected) => {
  if (connected) {
    console.log('🎉 MongoDB ready for requests');
  } else {
    console.log('⚠️  Server will run without database (mock mode)');
  }
});

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
