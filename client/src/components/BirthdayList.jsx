import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Paper
} from '@mui/material'
import { Cake as BirthdayIcon } from '@mui/icons-material'

const BirthdayList = () => {
  const [birthdays, setBirthdays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/mock/birthdays.json')
      .then(response => response.json())
      .then(data => {
        setBirthdays(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Ошибка загрузки дней рождения:', error)
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

  const getTodayBirthdays = () => {
    return birthdays.filter(person => person.isToday)
  }

  const getUpcomingBirthdays = () => {
    return birthdays.filter(person => !person.isToday)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <Typography>Загрузка дней рождения...</Typography>
      </Box>
    )
  }

  const todayBirthdays = getTodayBirthdays()
  const upcomingBirthdays = getUpcomingBirthdays()

  return (
    <Box>
        {todayBirthdays.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.dark', mb: 1 }}>
              Сегодня
            </Typography>
            {todayBirthdays.map((person) => (
              <Paper 
                key={person.id}
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  backgroundColor: 'rgba(217, 119, 6, 0.05)',
                  border: '1px solid',
                  borderColor: 'warning.light',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(217, 119, 6, 0.08)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 40, height: 40 }}>
                    {person.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {person.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {person.position}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {upcomingBirthdays.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.dark', mb: 1 }}>
              На этой неделе
            </Typography>
            {upcomingBirthdays.map((person) => (
              <Paper 
                key={person.id}
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  backgroundColor: 'rgba(14, 165, 233, 0.05)',
                  border: '1px solid',
                  borderColor: 'info.light',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 40, height: 40 }}>
                      {person.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {person.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {person.position}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={formatDate(person.birthday)}
                    size="small"
                    color="info"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {birthdays.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Нет дней рождения на этой неделе
          </Typography>
        )}
    </Box>
  )
}

export default BirthdayList
