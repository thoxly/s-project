const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');

// ELMA365 API configuration
const ELMA_API_URL = process.env.ELMA_API_URL;
const ELMA_TOKEN = process.env.ELMA_TOKEN;

// Попытка загрузить модель, если MongoDB подключена
let SupportRequest;
try {
  SupportRequest = require('../models/SupportRequest');
} catch (error) {
  console.warn('⚠️  SupportRequest model not available');
}

// Проверка подключения к MongoDB
const isMongoConnected = () => {
  const readyState = mongoose.connection.readyState;
  const hasModel = !!SupportRequest;
  return readyState === 1 && hasModel;
};

// CORS middleware для этого роутера - МАКСИМАЛЬНО ЛИБЕРАЛЬНАЯ ПОЛИТИКА
router.use((req, res, next) => {
  // Устанавливаем CORS заголовки для всех запросов
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Forwarded-For');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Credentials', 'false');
  
  // Обрабатываем preflight запросы сразу
  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS запрос в роутере elma:', req.path);
    res.status(204).end();
    return;
  }
  next();
});
router.post('/get_application', async (req, res) => {
  try {
    // req.body — это defaultRequestContext, который пришёл от ELMA
    const applicationData = req.body;
    console.log('📥 Получен webhook от ELMA с обновлением заявки:', JSON.stringify(applicationData, null, 2));

    // Извлекаем id_portal и статус из данных
    // ELMA может отправлять данные в разных форматах, пробуем разные варианты
    let idPortal = null;
    let newStatus = null;

    // Вариант 1: данные в корне объекта
    if (applicationData.id_portal || applicationData.id) {
      idPortal = applicationData.id_portal || applicationData.id;
    }
    
    // Вариант 2: данные в context
    if (applicationData.context && applicationData.context.id_portal) {
      idPortal = applicationData.context.id_portal;
    }

    // Извлекаем статус (может быть в разных полях)
    if (applicationData.status) {
      newStatus = applicationData.status;
    } else if (applicationData.currentStatus) {
      newStatus = applicationData.currentStatus;
    } else if (applicationData.context && applicationData.context.status) {
      newStatus = applicationData.context.status;
    }

    console.log('🔍 Извлеченные данные:', { idPortal, newStatus });

    if (!idPortal) {
      console.warn('⚠️  Не удалось извлечь id_portal из данных ELMA');
      return res.status(400).json({ 
        success: false,
        error: 'Отсутствует id_portal в данных от ELMA',
        receivedData: applicationData
      });
    }

    // Сохраняем или обновляем заявку в MongoDB
    if (isMongoConnected()) {
      try {
        // Ищем существующую заявку
        const existingRequest = await SupportRequest.findOne({ 
          'context.id_portal': idPortal 
        });

        if (existingRequest) {
          // Обновляем существующую заявку
          const updateData = {
            updatedAt: new Date()
          };

          // Обновляем статус, если он указан
          if (newStatus) {
            updateData.currentStatus = newStatus;
          }

          // Обновляем context, если пришли новые данные
          if (applicationData.context) {
            updateData.context = applicationData.context;
          } else if (applicationData) {
            // Если весь объект - это context
            updateData.context = { ...existingRequest.context, ...applicationData };
            if (idPortal) {
              updateData.context.id_portal = idPortal;
            }
          }

          const updatedRequest = await SupportRequest.findOneAndUpdate(
            { 'context.id_portal': idPortal },
            updateData,
            { new: true, runValidators: true }
          );

          console.log('✅ Заявка обновлена в MongoDB:', {
            id_portal: idPortal,
            status: updatedRequest.currentStatus
          });

          return res.json({ 
            success: true,
            message: 'Заявка успешно обновлена в базе данных',
            data: updatedRequest
          });
        } else {
          // Создаем новую заявку, если её нет
          const newRequest = new SupportRequest({
            context: applicationData.context || {
              ...applicationData,
              id_portal: idPortal
            },
            currentStatus: newStatus || 'Новая',
            sentAt: new Date()
          });

          const savedRequest = await newRequest.save();
          console.log('✅ Новая заявка создана в MongoDB:', {
            id_portal: idPortal,
            status: savedRequest.currentStatus
          });

          return res.json({ 
            success: true,
            message: 'Заявка успешно создана в базе данных',
            data: savedRequest
          });
        }
      } catch (dbError) {
        console.error('❌ Ошибка при работе с MongoDB:', dbError);
        return res.status(500).json({ 
          success: false,
          error: 'Ошибка при сохранении в базу данных',
          details: dbError.message
        });
      }
    } else {
      console.warn('⚠️  MongoDB не подключена, данные не сохранены');
      return res.status(503).json({ 
        success: false,
        error: 'MongoDB не подключена',
        receivedData: applicationData
      });
    }
  } catch (error) {
    console.error('❌ Ошибка при обработке webhook от ELMA:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
// Endpoint для проверки статуса (legacy, больше не используется, но оставлен для обратной совместимости)
// Теперь статусы сохраняются напрямую в MongoDB через /get_application
router.post('/check_status', async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Forwarded-For');
    
    console.log('ℹ️  /check_status вызван (legacy endpoint, статусы теперь сохраняются напрямую в MongoDB)');
    // Возвращаем пустой массив, так как буфер больше не используется
    res.json([]);
  } catch (error) {
    console.error('❌ Ошибка при обработке запроса /check_status: ', error);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Forwarded-For');
    res.status(500).json({ error: error.message });
  }
});
router.post('/post_application', async (req, res) => {
  try {
    // req.body — это defaultRequestContext, который пришёл с фронта
    const applicationData = req.body;
    console.log(applicationData)
    const response = await fetch('https://og4d3xrizqpay.elma365.ru/pub/v1/app/service_desk/applications/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 94803282-2c5f-44f1-a57f-d59552040232`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData), // ← отправляем тело, полученное с фронта
    });

    if (!response.ok) {
      throw new Error(`Ошибка от ELMA: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Ошибка при отправке в ELMA:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/get_data', async (req, res) => {
  try {
    const response = await fetch('https://og4d3xrizqpay.elma365.ru/api/extensions/583d4eea-7f06-47fd-b078-a0caf4f83095/script/post_articles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 94803282-2c5f-44f1-a57f-d59552040232`,
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create support request in ELMA365
router.post('/support', async (req, res) => {
  try {
    const { title, description, priority, userId } = req.body;
    
    // Mock response for development
    if (!ELMA_API_URL || !ELMA_TOKEN) {
      return res.json({
        success: true,
        processInstanceId: `mock-${Date.now()}`,
        message: 'Mock ELMA integration - request created successfully'
      });
    }
    
    // Real ELMA365 integration
    const elmaPayload = {
      title,
      description,
      priority: priority || 'normal',
      userId,
      timestamp: new Date().toISOString()
    };
    
    const response = await axios.post(`${ELMA_API_URL}/processes/support/start`, elmaPayload, {
      headers: {
        'Authorization': `Bearer ${ELMA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      success: true,
      processInstanceId: response.data.processInstanceId,
      message: 'Request created in ELMA365'
    });
    
  } catch (error) {
    console.error('ELMA integration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create request in ELMA365',
      details: error.message
    });
  }
});

// Get process status from ELMA365
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock response for development
    if (!ELMA_API_URL || !ELMA_TOKEN) {
      return res.json({
        processInstanceId: id,
        status: 'in_progress',
        message: 'Mock ELMA integration - status retrieved'
      });
    }
    
    // Real ELMA365 integration
    const response = await axios.get(`${ELMA_API_URL}/processes/${id}/status`, {
      headers: {
        'Authorization': `Bearer ${ELMA_TOKEN}`
      }
    });
    
    res.json(response.data);
    
  } catch (error) {
    console.error('ELMA status check error:', error);
    res.status(500).json({
      error: 'Failed to get process status',
      details: error.message
    });
  }
});

module.exports = router;
