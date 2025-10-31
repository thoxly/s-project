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
  // ВАЖНО: Всегда отвечаем 200 OK, чтобы ELMA не получал 502
  try {
    // req.body — это defaultRequestContext, который пришёл от ELMA
    const applicationData = req.body;
    
    // Подробное логирование для отладки
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📥 Webhook от ELMA получен:', new Date().toISOString());
    console.log('📥 URL:', req.originalUrl);
    console.log('📥 Заголовки:', JSON.stringify(req.headers, null, 2));
    console.log('📥 Тело запроса:', JSON.stringify(applicationData, null, 2));
    console.log('📊 MongoDB статус:', mongoose.connection.readyState === 1 ? '✅ Подключена' : '❌ Не подключена');
    console.log('═══════════════════════════════════════════════════════════');

    // Извлекаем id_portal и статус из данных
    // ELMA отправляет: { id, status, description, type, date, initiator, assignee }
    let idPortal = null;
    let newStatus = null;

    // Вариант 1: ELMA отправляет напрямую { id: "...", status: "..." }
    if (applicationData.id_portal || applicationData.id) {
      idPortal = applicationData.id_portal || applicationData.id;
    }
    
    // Вариант 2: данные в context (для других форматов)
    if (applicationData.context && applicationData.context.id_portal) {
      idPortal = applicationData.context.id_portal;
    }

    // Извлекаем статус (ELMA отправляет в поле "status")
    if (applicationData.status) {
      newStatus = applicationData.status;
    } else if (applicationData.currentStatus) {
      newStatus = applicationData.currentStatus;
    } else if (applicationData.context && applicationData.context.status) {
      newStatus = applicationData.context.status;
    }

    console.log('🔍 Извлеченные данные:', { 
      idPortal, 
      newStatus,
      receivedFields: Object.keys(applicationData)
    });

    if (!idPortal) {
      console.warn('⚠️  Не удалось извлечь id_portal из данных ELMA');
      // Возвращаем 200 OK, но с флагом warning
      return res.status(200).json({ 
        success: true,
        warning: 'Не удалось извлечь id_portal, данные получены но не сохранены',
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

          // Обновляем статус, если он указан (ELMA отправляет в поле "status")
          if (newStatus) {
            updateData.currentStatus = newStatus;
          }

          // Обновляем context с данными от ELMA
          // ELMA отправляет: { id, status, description, type, date, initiator, assignee }
          if (applicationData.context) {
            // Если данные уже в context
            updateData.context = { ...existingRequest.context, ...applicationData.context };
            updateData.context.id_portal = idPortal;
            // Обрабатываем solution_description: проверяем верхний уровень (приоритет) и context
            if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
              // Приоритет верхнему уровню, если он есть
              updateData.context.solution_description = applicationData.solution_description;
            } else if (applicationData.context.solution_description !== null && applicationData.context.solution_description !== undefined) {
              // Если нет на верхнем уровне, берем из context
              updateData.context.solution_description = applicationData.context.solution_description;
            }
          } else {
            // Если данные пришли напрямую от ELMA, маппим их в context
            updateData.context = {
              ...existingRequest.context,
              id_portal: idPortal,
              // Сохраняем данные от ELMA в context
              application_text: applicationData.description || existingRequest.context?.application_text,
              // Обновляем другие поля если они есть
              ...(applicationData.type && { service: [applicationData.type] }),
              ...(applicationData.assignee && { responsible: [applicationData.assignee] }),
              ...(applicationData.initiator && { aplicant: [applicationData.initiator] }),
            };
            // Обрабатываем solution_description: если не null, сохраняем
            if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
              updateData.context.solution_description = applicationData.solution_description;
            }
          }

          const updatedRequest = await SupportRequest.findOneAndUpdate(
            { 'context.id_portal': idPortal },
            updateData,
            { new: true, runValidators: false } // Отключаем строгую валидацию для статусов от ELMA
          );

          console.log('✅ Заявка обновлена в MongoDB:', {
            id_portal: idPortal,
            status: updatedRequest.currentStatus
          });

          return res.status(200).json({ 
            success: true,
            message: 'Заявка успешно обновлена в базе данных',
            data: updatedRequest
          });
        } else {
          // Создаем новую заявку, если её нет
          // ELMA отправляет: { id, status, description, type, date, initiator, assignee }
          const contextData = applicationData.context || {
            id_portal: idPortal,
            application_text: applicationData.description || applicationData.application_text || '-',
            ...(applicationData.type && { service: [applicationData.type] }),
            ...(applicationData.assignee && { responsible: [applicationData.assignee] }),
            ...(applicationData.initiator && { aplicant: [applicationData.initiator] }),
          };
          
          // Обрабатываем solution_description: проверяем верхний уровень (приоритет) и context
          if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
            // Приоритет верхнему уровню, если он есть
            contextData.solution_description = applicationData.solution_description;
          } else if (applicationData.context?.solution_description !== null && applicationData.context?.solution_description !== undefined) {
            // Если нет на верхнем уровне, берем из context
            contextData.solution_description = applicationData.context.solution_description;
          }
          
          const newRequest = new SupportRequest({
            context: contextData,
            currentStatus: newStatus || 'Новая',
            sentAt: new Date()
          });

          const savedRequest = await newRequest.save();
          console.log('✅ Новая заявка создана в MongoDB:', {
            id_portal: idPortal,
            status: savedRequest.currentStatus
          });

          return res.status(200).json({ 
            success: true,
            message: 'Заявка успешно создана в базе данных',
            data: savedRequest
          });
        }
      } catch (dbError) {
        console.error('❌ Ошибка при работе с MongoDB:', dbError);
        console.error('❌ Stack trace:', dbError.stack);
        // Возвращаем 200 OK, чтобы ELMA не получал 502
        return res.status(200).json({ 
          success: true,
          warning: 'Webhook получен, но не удалось сохранить в БД',
          error: dbError.message,
          receivedData: applicationData
        });
      }
    } else {
      console.warn('⚠️  MongoDB не подключена, данные не сохранены');
      console.warn('⚠️  Данные от ELMA получены успешно, но будут потеряны');
      // Возвращаем 200 OK, чтобы ELMA не получал 502
      return res.status(200).json({ 
        success: true,
        warning: 'MongoDB не подключена, данные получены но не сохранены',
        receivedData: applicationData
      });
    }
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА при обработке webhook от ELMA:', error);
    console.error('❌ Stack trace:', error.stack);
    // Всегда возвращаем 200 OK, чтобы ELMA не получал 502
    return res.status(200).json({ 
      success: true,
      warning: 'Webhook получен, но произошла ошибка при обработке',
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
