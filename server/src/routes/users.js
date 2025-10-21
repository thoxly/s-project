const express = require('express');
const router = express.Router();

// Mock data for development
const mockUsers = [
  {
    id: 1,
    name: 'Иван Петров',
    position: 'Руководитель IT-отдела',
    email: 'ivan.petrov@company.com',
    phone: '+7 (495) 123-45-67',
    department: 'IT',
    avatar: '/avatars/ivan.jpg',
    birthday: '1985-03-15',
    isManager: true
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    position: 'Системный администратор',
    email: 'anna.sidorova@company.com',
    phone: '+7 (495) 123-45-68',
    department: 'IT',
    avatar: '/avatars/anna.jpg',
    birthday: '1990-07-22',
    isManager: false
  },
  {
    id: 3,
    name: 'Михаил Козлов',
    position: 'Менеджер по продажам',
    email: 'mikhail.kozlov@company.com',
    phone: '+7 (495) 123-45-69',
    department: 'Sales',
    avatar: '/avatars/mikhail.jpg',
    birthday: '1988-11-08',
    isManager: false
  }
];

// Get all users
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
    total: mockUsers.length
  });
});

// Get single user
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = mockUsers.find(u => u.id === parseInt(id));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Get users by department
router.get('/department/:department', (req, res) => {
  const { department } = req.params;
  const departmentUsers = mockUsers.filter(u => 
    u.department.toLowerCase() === department.toLowerCase()
  );
  
  res.json({
    success: true,
    data: departmentUsers,
    total: departmentUsers.length
  });
});

// Get current user profile (mock)
router.get('/profile/current', (req, res) => {
  // In real app, this would be based on authentication
  const currentUser = mockUsers[0]; // Mock current user
  
  res.json({
    success: true,
    data: currentUser
  });
});

module.exports = router;
