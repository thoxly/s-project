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

// Функция для получения solution_description из ELMA по id_elma_app
const getSolutionFromElma = async (idElmaApp) => {
  try {
    console.log(`🔍 Запрашиваю solution_description из ELMA для id: ${idElmaApp}`);
    
    const response = await fetch(
      `https://og4d3xrizqpay.elma365.ru/pub/v1/app/service_desk/applications/${idElmaApp}/get`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer 94803282-2c5f-44f1-a57f-d59552040232`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ Ошибка при запросе к ELMA: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.item && data.item.solution_description) {
      console.log(`✅ solution_description получен из ELMA: ${data.item.solution_description.substring(0, 50)}...`);
      return data.item.solution_description;
    } else {
      console.warn(`⚠️  solution_description не найден в ответе ELMA`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Ошибка при получении данных из ELMA:`, error);
    return null;
  }
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

    // Извлекаем id_portal, статус и id_elma_app из данных
    // ELMA отправляет: { id, status, description, type, date, initiator, assignee, id_elma_app }
    let idPortal = null;
    let newStatus = null;
    let idElmaApp = null;

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

    // Извлекаем id_elma_app (ELMA отправляет в поле "id_elma_app" или "__id")
    if (applicationData.id_elma_app) {
      idElmaApp = applicationData.id_elma_app;
    } else if (applicationData.__id) {
      idElmaApp = applicationData.__id;
    } else if (applicationData.context && applicationData.context.id_elma_app) {
      idElmaApp = applicationData.context.id_elma_app;
    }

    console.log('🔍 Извлеченные данные:', { 
      idPortal, 
      newStatus,
      idElmaApp,
      solution_description: applicationData.solution_description || applicationData.context?.solution_description,
      receivedFields: Object.keys(applicationData)
    });

    // ВАЖНО: Проверяем, что id_portal не "-" (это означает ошибку от ELMA)
    if (!idPortal || idPortal === '-' || idPortal === 'undefined') {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Некорректный id_portal:', idPortal);
      console.error('📋 Полные данные от ELMA:', JSON.stringify(applicationData, null, 2));
      // Возвращаем 200 OK, чтобы ELMA не получал 502
      return res.status(200).json({ 
        success: true,
        warning: `Некорректный id_portal (${idPortal}), данные получены но не сохранены. Проверьте, что ELMA отправляет корректный id_portal.`,
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

          // Если статус "Выполнена" или "Выполнено" и есть id_elma_app, запрашиваем solution_description из ELMA
          let fetchedSolution = null;
          if ((newStatus === 'Выполнена' || newStatus === 'Выполнено') && idElmaApp) {
            console.log('🎯 Статус "Выполнена" и id_elma_app присутствует, запрашиваю solution_description из ELMA');
            fetchedSolution = await getSolutionFromElma(idElmaApp);
          }

          // Обновляем context с данными от ELMA
          // ELMA отправляет: { id, status, description, type, date, initiator, assignee, solution_description, id_elma_app }
          if (applicationData.context) {
            // Если данные уже в context (редкий случай)
            console.log('📦 ELMA прислала данные с полем context');
            updateData.context = { ...existingRequest.context, ...applicationData.context };
            updateData.context.id_portal = idPortal;
            
            // Сохраняем id_elma_app
            if (idElmaApp) {
              updateData.context.id_elma_app = idElmaApp;
              console.log('💾 id_elma_app сохранён в context:', idElmaApp);
            }
            
            // Обрабатываем solution_description: приоритет fetchedSolution, потом верхний уровень, потом context
            if (fetchedSolution) {
              // Самый высокий приоритет - данные, полученные из ELMA API
              updateData.context.solution_description = fetchedSolution;
              console.log('💡 solution_description взят из ELMA API:', fetchedSolution.substring(0, 50) + '...');
            } else if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
              // Приоритет верхнему уровню, если он есть
              updateData.context.solution_description = applicationData.solution_description;
              console.log('💡 solution_description взят с верхнего уровня:', applicationData.solution_description);
            } else if (applicationData.context.solution_description !== null && applicationData.context.solution_description !== undefined) {
              // Если нет на верхнем уровне, берем из context
              updateData.context.solution_description = applicationData.context.solution_description;
              console.log('💡 solution_description взят из context:', applicationData.context.solution_description);
            }
          } else {
            // Если данные пришли напрямую от ELMA (основной случай), маппим их в context
            console.log('📦 ELMA прислала данные БЕЗ поля context (стандартный формат)');
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
            
            // Сохраняем id_elma_app
            if (idElmaApp) {
              updateData.context.id_elma_app = idElmaApp;
              console.log('💾 id_elma_app сохранён в context:', idElmaApp);
            }
            
            // Обрабатываем solution_description: приоритет fetchedSolution, потом данные от ELMA
            if (fetchedSolution) {
              // Самый высокий приоритет - данные, полученные из ELMA API
              updateData.context.solution_description = fetchedSolution;
              console.log('✅ solution_description получен из ELMA API и сохранён:', fetchedSolution.substring(0, 50) + '...');
            } else if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
              updateData.context.solution_description = applicationData.solution_description;
              console.log('✅ solution_description сохранён в context:', applicationData.solution_description);
            } else {
              console.log('⚠️  solution_description отсутствует или null:', applicationData.solution_description);
            }
          }

          const updatedRequest = await SupportRequest.findOneAndUpdate(
            { 'context.id_portal': idPortal },
            updateData,
            { new: true, runValidators: false } // Отключаем строгую валидацию для статусов от ELMA
          );

          console.log('✅ Заявка обновлена в MongoDB:', {
            _id: updatedRequest._id,
            id_portal: idPortal,
            status: updatedRequest.currentStatus,
            has_solution: !!updatedRequest.context?.solution_description,
            solution_preview: updatedRequest.context?.solution_description ? 
              updatedRequest.context.solution_description.substring(0, 50) + '...' : 
              'отсутствует'
          });

          return res.status(200).json({ 
            success: true,
            message: 'Заявка успешно обновлена в базе данных',
            data: updatedRequest
          });
        } else {
          // Создаем новую заявку, если её нет
          console.log('🆕 Заявка с id_portal не найдена, создаём новую:', idPortal);
          
          // Если статус "Выполнена" или "Выполнено" и есть id_elma_app, запрашиваем solution_description из ELMA
          let fetchedSolution = null;
          if ((newStatus === 'Выполнена' || newStatus === 'Выполнено') && idElmaApp) {
            console.log('🎯 Статус "Выполнена" при создании и id_elma_app присутствует, запрашиваю solution_description из ELMA');
            fetchedSolution = await getSolutionFromElma(idElmaApp);
          }
          
          // ELMA отправляет: { id, status, description, type, date, initiator, assignee, solution_description, id_elma_app }
          const contextData = applicationData.context || {
            id_portal: idPortal,
            application_text: applicationData.description || applicationData.application_text || '-',
            ...(applicationData.type && { service: [applicationData.type] }),
            ...(applicationData.assignee && { responsible: [applicationData.assignee] }),
            ...(applicationData.initiator && { aplicant: [applicationData.initiator] }),
          };
          
          // Сохраняем id_elma_app
          if (idElmaApp) {
            contextData.id_elma_app = idElmaApp;
            console.log('💾 id_elma_app сохранён при создании заявки:', idElmaApp);
          }
          
          // Обрабатываем solution_description: приоритет fetchedSolution, потом верхний уровень, потом context
          if (fetchedSolution) {
            // Самый высокий приоритет - данные, полученные из ELMA API
            contextData.solution_description = fetchedSolution;
            console.log('✅ solution_description получен из ELMA API при создании:', fetchedSolution.substring(0, 50) + '...');
          } else if (applicationData.solution_description !== null && applicationData.solution_description !== undefined) {
            // Приоритет верхнему уровню, если он есть
            contextData.solution_description = applicationData.solution_description;
            console.log('✅ solution_description сохранён при создании заявки:', applicationData.solution_description);
          } else if (applicationData.context?.solution_description !== null && applicationData.context?.solution_description !== undefined) {
            // Если нет на верхнем уровне, берем из context
            contextData.solution_description = applicationData.context.solution_description;
            console.log('✅ solution_description взят из context при создании:', applicationData.context.solution_description);
          } else {
            console.log('⚠️  solution_description отсутствует при создании заявки');
          }
          
          console.log('📋 Данные для создания заявки:', {
            id_portal: contextData.id_portal,
            id_elma_app: contextData.id_elma_app,
            application_text: contextData.application_text,
            solution_description: contextData.solution_description,
            status: newStatus || 'Новая'
          });
          
          const newRequest = new SupportRequest({
            context: contextData,
            currentStatus: newStatus || 'Новая',
            sentAt: new Date()
          });

          const savedRequest = await newRequest.save();
          console.log('✅ Новая заявка создана в MongoDB:', {
            _id: savedRequest._id,
            id_portal: idPortal,
            status: savedRequest.currentStatus,
            has_solution: !!savedRequest.context?.solution_description
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
