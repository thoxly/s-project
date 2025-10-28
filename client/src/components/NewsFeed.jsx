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
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Announcement as NewsIcon } from '@mui/icons-material'

const NewsFeed = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={isMobile ? "80px" : "100px"}>
        <Typography variant={isMobile ? "body2" : "body1"}>Загрузка новостей...</Typography>
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
              p: { xs: 2, sm: 3 }, 
              mb: index < news.length - 1 ? { xs: 1.5, sm: 2 } : 0,
              border: '1px solid',
              borderColor: 'primary.light',
              backgroundColor: 'rgba(30, 58, 138, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(30, 58, 138, 0.08)',
                transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              },
              transition: 'all 0.2s ease-in-out',
              borderRadius: { xs: 1.5, sm: 2 }
            }}
          >
            <Typography 
              variant={isMobile ? "body1" : "subtitle1"} 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                lineHeight: { xs: 1.3, sm: 1.2 }
              }}
            >
              {item.title}
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body2"} 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              {item.summary}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.75, sm: 1 }, 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Chip 
                label="Новость" 
                size={isMobile ? "small" : "small"} 
                color="primary" 
                sx={{ 
                  borderRadius: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  height: { xs: 24, sm: 28 }
                }}
              />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {formatDate(item.date)}
              </Typography>
            </Box>
          </Paper>
          {index < news.length - 1 && <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />}
        </Box>
      ))}
      
      <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
        <Button 
          variant="outlined" 
          size={isMobile ? "small" : "small"}
          fullWidth={isMobile}
          sx={{ 
            fontWeight: 500,
            borderRadius: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
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
