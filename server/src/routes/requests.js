const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// CORS middleware для этого роутера (дополнительная защита)
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Попытка загрузить модель, если MongoDB подключена
let SupportRequest;
try {
  SupportRequest = require('../models/SupportRequest');
} catch (error) {
  console.warn('⚠️  SupportRequest model not available');
}

// Mock data for development (fallback)
const mockRequests = [
  {
    id: 1,
    title: 'Проблема с принтером',
    description: 'Принтер в офисе не печатает',
    status: 'in_progress',
    priority: 'high',
    userId: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 2,
    title: 'Установка программного обеспечения',
    description: 'Нужно установить Adobe Photoshop',
    status: 'completed',
    priority: 'medium',
    userId: 2,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: 3,
    title: 'Настройка почты',
    description: 'Помощь с настройкой корпоративной почты',
    status: 'pending',
    priority: 'low',
    userId: 3,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z'
  }
];

// Проверка подключения к MongoDB
const isMongoConnected = () => {
  const readyState = mongoose.connection.readyState;
  const hasModel = !!SupportRequest;
  const connected = readyState === 1 && hasModel;
  
  if (!connected) {
    console.warn('⚠️  isMongoConnected() returned false:', {
      readyState,
      readyStateText: readyState === 0 ? 'disconnected' : 
                      readyState === 1 ? 'connected' :
                      readyState === 2 ? 'connecting' :
                      readyState === 3 ? 'disconnecting' : 'unknown',
      hasModel,
      modelName: SupportRequest ? SupportRequest.modelName : 'undefined'
    });
  }
  
  return connected;
};

// Get all support requests (заявки в техподдержку)
router.get('/support', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const requests = await SupportRequest.find()
        .sort({ createdAt: -1 })
        .lean();
      
      return res.json({
        success: true,
        data: requests,
        total: requests.length,
        message: "Заявки в техподдержку загружены из базы данных"
      });
    } else {
      // Fallback to mock data
      return res.json({
        success: true,
        data: [],
        total: 0,
        message: "MongoDB не подключена, используется режим моков"
      });
    }
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get support request by id_portal
router.get('/support/:idPortal', async (req, res) => {
  try {
    const { idPortal } = req.params;
    
    if (isMongoConnected()) {
      const request = await SupportRequest.findOne({ 'context.id_portal': idPortal }).lean();
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Заявка не найдена'
        });
      }
      
      return res.json({
        success: true,
        data: request
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'MongoDB не подключена'
      });
    }
  } catch (error) {
    console.error('Ошибка при получении заявки:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new support request (заявка в техподдержку)
router.post('/support', async (req, res) => {
  try {
    const requestData = req.body;
    
    console.log('📥 POST /api/requests/support - Получен запрос на создание заявки');
    console.log('📋 Тело запроса:', JSON.stringify(requestData, null, 2));
    console.log('🔌 Состояние MongoDB:', {
      readyState: mongoose.connection.readyState,
      isConnected: mongoose.connection.readyState === 1,
      hasModel: !!SupportRequest
    });
    
    const mongoConnected = isMongoConnected();
    console.log('✅ isMongoConnected():', mongoConnected);
    
    if (!mongoConnected) {
      console.error('❌ MongoDB не подключена! Состояние:', {
        readyState: mongoose.connection.readyState,
        readyStateText: mongoose.connection.readyState === 0 ? 'disconnected' : 
                        mongoose.connection.readyState === 1 ? 'connected' :
                        mongoose.connection.readyState === 2 ? 'connecting' :
                        mongoose.connection.readyState === 3 ? 'disconnecting' : 'unknown',
        hasModel: !!SupportRequest
      });
      return res.status(503).json({
        success: false,
        error: 'MongoDB не подключена. Заявка не может быть сохранена.',
        debug: {
          readyState: mongoose.connection.readyState,
          hasModel: !!SupportRequest
        }
      });
    }
    
    // Проверяем обязательные поля
    if (!requestData.context || !requestData.context.id_portal || !requestData.context.application_text) {
      console.error('❌ Отсутствуют обязательные поля:', {
        hasContext: !!requestData.context,
        hasIdPortal: !!(requestData.context && requestData.context.id_portal),
        hasApplicationText: !!(requestData.context && requestData.context.application_text)
      });
      return res.status(400).json({
        success: false,
        error: 'Отсутствуют обязательные поля: context.id_portal и context.application_text'
      });
    }
    
    console.log('🔍 Проверка существующей заявки с id_portal:', requestData.context.id_portal);
    
    // Проверяем, не существует ли уже заявка с таким id_portal
    const existingRequest = await SupportRequest.findOne({ 
      'context.id_portal': requestData.context.id_portal 
    });
    
    if (existingRequest) {
      console.warn('⚠️ Заявка с таким id_portal уже существует:', requestData.context.id_portal);
      return res.status(409).json({
        success: false,
        error: 'Заявка с таким id_portal уже существует'
      });
    }
    
    console.log('✨ Создание новой заявки...');
    
    // Подготовка context с обработкой solution_description
    const contextData = { ...requestData.context };
    // Если solution_description равен null, удаляем его из context
    if (contextData.solution_description === null || contextData.solution_description === undefined) {
      delete contextData.solution_description;
    }
    
    const newRequest = new SupportRequest({
      context: contextData,
      sentAt: requestData.sentAt ? new Date(requestData.sentAt) : new Date(),
      currentStatus: requestData.currentStatus || 'Новая',
      userId: requestData.userId || null
    });
    
    console.log('💾 Попытка сохранить заявку в БД...');
    const savedRequest = await newRequest.save();
    
    console.log('✅ Заявка успешно сохранена в БД:', {
      id: savedRequest._id,
      id_portal: savedRequest.context.id_portal,
      status: savedRequest.currentStatus
    });
    
    return res.status(201).json({
      success: true,
      data: savedRequest,
      message: 'Заявка в техподдержку успешно создана'
    });
  } catch (error) {
    console.error('❌ Ошибка при создании заявки:', error);
    console.error('📊 Детали ошибки:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      errors: error.errors
    });
    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        code: error.code,
        errors: error.errors
      } : undefined
    });
  }
});

// Update support request status
router.patch('/support/:idPortal/status', async (req, res) => {
  try {
    const { idPortal } = req.params;
    const { currentStatus } = req.body;
    
    if (!currentStatus) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствует поле currentStatus'
      });
    }
    
    if (isMongoConnected()) {
      const request = await SupportRequest.findOneAndUpdate(
        { 'context.id_portal': idPortal },
        { 
          currentStatus: currentStatus,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Заявка не найдена'
        });
      }
      
      return res.json({
        success: true,
        data: request,
        message: 'Статус заявки обновлен'
      });
    } else {
      return res.status(503).json({
        success: false,
        error: 'MongoDB не подключена'
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update support request (полное обновление)
router.put('/support/:idPortal', async (req, res) => {
  try {
    const { idPortal } = req.params;
    const updateData = req.body;
    
    if (isMongoConnected()) {
      const request = await SupportRequest.findOneAndUpdate(
        { 'context.id_portal': idPortal },
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Заявка не найдена'
        });
      }
      
      return res.json({
        success: true,
        data: request,
        message: 'Заявка обновлена'
      });
    } else {
      return res.status(503).json({
        success: false,
        error: 'MongoDB не подключена'
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении заявки:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get requests by user ID (legacy endpoint)
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userRequests = mockRequests.filter(req => req.userId === parseInt(userId));
  
  res.json({
    success: true,
    data: userRequests,
    total: userRequests.length
  });
});

// Get all requests (legacy endpoint)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockRequests,
    total: mockRequests.length,
    message: "🔥 Hot reload is working! Server restarted automatically."
  });
});

// Get single request (legacy endpoint)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const request = mockRequests.find(req => req.id === parseInt(id));
  
  if (!request) {
    return res.status(404).json({
      success: false,
      error: 'Request not found'
    });
  }
  
  res.json({
    success: true,
    data: request
  });
});

// Create new request (legacy endpoint)
router.post('/', (req, res) => {
  const { title, description, priority, userId } = req.body;
  
  const newRequest = {
    id: mockRequests.length + 1,
    title,
    description,
    status: 'pending',
    priority: priority || 'medium',
    userId: userId || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockRequests.push(newRequest);
  
  res.status(201).json({
    success: true,
    data: newRequest,
    message: 'Request created successfully'
  });
});

// Update request status (legacy endpoint)
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const request = mockRequests.find(req => req.id === parseInt(id));
  
  if (!request) {
    return res.status(404).json({
      success: false,
      error: 'Request not found'
    });
  }
  
  request.status = status;
  request.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: request,
    message: 'Request status updated'
  });
});

module.exports = router;
