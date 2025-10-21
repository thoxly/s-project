const express = require('express');
const router = express.Router();

// Mock data for departments
const mockDepartments = [
  {
    id: 1,
    name: 'IT-отдел',
    parentId: null,
    managerId: 1,
    employees: [1, 2],
    description: 'Отдел информационных технологий'
  },
  {
    id: 2,
    name: 'Отдел продаж',
    parentId: null,
    managerId: 3,
    employees: [3],
    description: 'Отдел продаж и маркетинга'
  },
  {
    id: 3,
    name: 'HR-отдел',
    parentId: null,
    managerId: 4,
    employees: [4],
    description: 'Отдел кадров'
  }
];

// Mock data for services
const mockServices = [
  {
    id: 1,
    title: 'Техническая поддержка',
    description: 'Решение технических проблем',
    category: 'IT',
    targetAudience: 'all',
    processCode: 'SUPPORT_TECH',
    icon: 'support_agent'
  },
  {
    id: 2,
    title: 'Заявка на отпуск',
    description: 'Подача заявки на отпуск',
    category: 'HR',
    targetAudience: 'employees',
    processCode: 'VACATION_REQUEST',
    icon: 'event'
  },
  {
    id: 3,
    title: 'Заказ канцелярии',
    description: 'Заказ канцелярских товаров',
    category: 'Admin',
    targetAudience: 'all',
    processCode: 'STATIONERY_ORDER',
    icon: 'inventory'
  }
];

// Mock data for articles
const mockArticles = [
  {
    id: 1,
    title: 'Политика информационной безопасности',
    content: 'Основные правила работы с корпоративными данными...',
    category: 'Административная',
    tags: ['безопасность', 'политика', 'документы'],
    author: 'IT-отдел',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 2,
    title: 'Настройка корпоративной почты',
    content: 'Пошаговая инструкция по настройке Outlook...',
    category: 'Техническая',
    tags: ['почта', 'outlook', 'настройка'],
    author: 'IT-отдел',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  }
];

// Get departments
router.get('/departments', (req, res) => {
  res.json({
    success: true,
    data: mockDepartments,
    total: mockDepartments.length
  });
});

// Get services
router.get('/services', (req, res) => {
  const { category, audience } = req.query;
  
  let filteredServices = mockServices;
  
  if (category) {
    filteredServices = filteredServices.filter(s => 
      s.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (audience) {
    filteredServices = filteredServices.filter(s => 
      s.targetAudience === audience || s.targetAudience === 'all'
    );
  }
  
  res.json({
    success: true,
    data: filteredServices,
    total: filteredServices.length
  });
});

// Get articles
router.get('/articles', (req, res) => {
  const { category, search } = req.query;
  
  let filteredArticles = mockArticles;
  
  if (category) {
    filteredArticles = filteredArticles.filter(a => 
      a.category === category
    );
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredArticles = filteredArticles.filter(a => 
      a.title.toLowerCase().includes(searchLower) ||
      a.content.toLowerCase().includes(searchLower) ||
      a.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  res.json({
    success: true,
    data: filteredArticles,
    total: filteredArticles.length
  });
});

// Get news feed
router.get('/news', (req, res) => {
  const mockNews = [
    {
      id: 1,
      title: 'Новое обновление корпоративного портала',
      content: 'Добавлены новые функции и улучшен интерфейс...',
      author: 'IT-отдел',
      createdAt: '2024-01-16T09:00:00Z',
      type: 'update'
    },
    {
      id: 2,
      title: 'Корпоративное мероприятие',
      content: 'Приглашаем всех на корпоративную вечеринку...',
      author: 'HR-отдел',
      createdAt: '2024-01-15T16:30:00Z',
      type: 'event'
    }
  ];
  
  res.json({
    success: true,
    data: mockNews,
    total: mockNews.length
  });
});

module.exports = router;
