import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Avatar,
  Paper
} from '@mui/material'
import { Announcement as NewsIcon } from '@mui/icons-material'

const NewsFeed = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем данные из mock файла
    fetch('/mock/news.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        setNews(data.slice(0, 3)) // Показываем только первые 3 новости
        setLoading(false)
      })
      .catch(error => {
        console.error('Ошибка загрузки новостей:', error)
        // Показываем заглушку при ошибке
        setNews([
          {
            id: 1,
            title: "Добро пожаловать в Portal S",
            date: new Date().toISOString().split('T')[0],
            summary: "Корпоративный портал готов к работе. Все системы функционируют нормально."
          }
        ])
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <Typography>Загрузка новостей...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {news.map((item, index) => (
        <Box key={item.id}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: index < news.length - 1 ? 2 : 0,
              border: '1px solid',
              borderColor: 'primary.light',
              backgroundColor: 'rgba(30, 58, 138, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.08)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              },
              transition: 'all 0.2s ease-in-out',
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {item.summary}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label="Новость" 
                size="small" 
                color="primary" 
                sx={{ borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(item.date)}
              </Typography>
            </Box>
          </Paper>
          {index < news.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
      
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            fontWeight: 500,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Все новости
        </Button>
      </Box>
    </Box>
  )
}

export default NewsFeed
