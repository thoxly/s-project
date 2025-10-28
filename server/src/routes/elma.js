const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// ELMA365 API configuration
const ELMA_API_URL = process.env.ELMA_API_URL;
const ELMA_TOKEN = process.env.ELMA_TOKEN;
const ELMA_WEBHOOK_URL=process.env.ELMA_WEBHOOK_URL
const ELMA_WEBHOOK_TOKEN=process.env.ELMA_WEBHOOK_TOKEN

router.post('/get_data', async (req, res) => {
  console.log(ELMA_WEBHOOK_URL)
  console.log(ELMA_WEBHOOK_TOKEN)
  try {
    const response = await fetch(`${ELMA_WEBHOOK_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ELMA_WEBHOOK_TOKEN}`,
      },
    });

    const data = await response.json();
    console.log(data)
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
