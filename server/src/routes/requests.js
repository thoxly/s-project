const express = require('express');
const router = express.Router();

// Mock data for development
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

// Get all requests
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockRequests,
    total: mockRequests.length
  });
});

// Get requests by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userRequests = mockRequests.filter(req => req.userId === parseInt(userId));
  
  res.json({
    success: true,
    data: userRequests,
    total: userRequests.length
  });
});

// Get single request
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

// Create new request
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

// Update request status
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
