const express = require('express');
const axios = require('axios');
const router = express.Router();

// ELMA365 API configuration
const ELMA_API_URL = process.env.ELMA_API_URL;
const ELMA_TOKEN = process.env.ELMA_TOKEN;
let status_check_arr=[]
router.post('/get_application', async (req, res) => {
  try {
    // req.body — это defaultRequestContext, который пришёл с фронта
    const applicationData = req.body;
    status_check_arr.push(applicationData)
    console.log('длина массива',status_check_arr.length)
    console.log('Получен запрос на обновление заявки:', applicationData);

    res.json({ message: 'Заявка успешно получена', receivedData: applicationData });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/check_status', async (req, res) => {
  try {
    // Возвращаем массив данных
    res.json(status_check_arr);
    status_check_arr=[]
  } catch (error) {
    console.error('Ошибка при обработке запроса: ', error);
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
