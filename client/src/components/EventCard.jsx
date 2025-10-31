import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material'
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material'

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'corporate':
        return 'primary'
      case 'training':
        return 'secondary'
      case 'seminar':
        return 'info'
      case 'sports':
        return 'success'
      default:
        return 'default'
    }
  }

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'corporate':
        return 'Корпоратив'
      case 'training':
        return 'Тренинг'
      case 'seminar':
        return 'Семинар'
      case 'sports':
        return 'Спорт'
      default:
        return 'Событие'
    }
  }

  return (
    <Card
      sx={{
        minWidth: { xs: 260, sm: 280 },
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "&:hover": {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
          transform: "translateY(-2px)",
        },
        transition: "all 0.2s ease-in-out",
        width:'100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <EventIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {event.title}
            </Typography>
            <Chip 
              label={getEventTypeLabel(event.type)}
              size="small"
              color={getEventTypeColor(event.type)}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {event.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box display="flex" alignItems="center" mb={1}>
            <TimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(event.date)} в {event.time}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EventCard
