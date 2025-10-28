import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider
} from '@mui/material'
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material'

const ColleagueThanksBlock = () => {
  const achievements = [
    {
      id: 1,
      title: "Отличная работа над проектом",
      from: "Петров П.П.",
      date: "15.12.2024",
      type: "achievement"
    },
    {
      id: 2,
      title: "Помощь в решении сложной задачи",
      from: "Сидорова А.А.",
      date: "10.12.2024",
      type: "help"
    },
    {
      id: 3,
      title: "Профессиональный подход к работе",
      from: "Козлов В.В.",
      date: "05.12.2024",
      type: "professional"
    }
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <TrophyIcon sx={{ color: 'warning.main' }} />
      case 'help':
        return <ThumbUpIcon sx={{ color: 'success.main' }} />
      case 'professional':
        return <StarIcon sx={{ color: 'primary.main' }} />
      default:
        return <StarIcon />
    }
  }

  const getChipColor = (type) => {
    switch (type) {
      case 'achievement':
        return 'warning'
      case 'help':
        return 'success'
      case 'professional':
        return 'primary'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 400, mb: 2, display: 'flex', alignItems: 'center', fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif', letterSpacing: '0.01em' }}>
        <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
        Успехи и достижения
      </Typography>
      
      <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {achievements.map((achievement, index) => (
          <Card 
            key={achievement.id}
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 300ms ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.light', 
                  width: 32, 
                  height: 32, 
                  mr: 1.5,
                  fontSize: '0.875rem'
                }}>
                  {achievement.from.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 400, mb: 0.5, fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif' }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    от {achievement.from} • {achievement.date}
                  </Typography>
                </Box>
                <Chip
                  icon={getIcon(achievement.type)}
                  label={achievement.type === 'achievement' ? 'Достижение' : 
                         achievement.type === 'help' ? 'Помощь' : 'Профессионализм'}
                  size="small"
                  color={getChipColor(achievement.type)}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {achievements.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          color: 'text.secondary'
        }}>
          <StarIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
          <Typography variant="body2">
            Пока нет благодарностей от коллег
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ColleagueThanksBlock
