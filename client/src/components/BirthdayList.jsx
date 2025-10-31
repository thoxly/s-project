import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Cake as BirthdayIcon } from '@mui/icons-material'
const BirthdayList = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={isMobile ? "80px" : "100px"}>
        <Typography variant={isMobile ? "body2" : "body1"}>Загрузка дней рождения...</Typography>
      </Box>
    )
  }

  const todayBirthdays = getTodayBirthdays()
  const upcomingBirthdays = getUpcomingBirthdays()

  return (
    <Box>
        {todayBirthdays.length > 0 && (
          <Box mb={{ xs: 2, sm: 3 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: 'warning.dark', 
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Сегодня
            </Typography>
            {todayBirthdays.map((person) => (
              <Paper 
                key={person.id}
                variant="outlined" 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  mb: { xs: 1.5, sm: 2 },
                  backgroundColor: 'rgba(217, 119, 6, 0.05)',
                  border: '1px solid',
                  borderColor: 'warning.light',
                  borderRadius: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    backgroundColor: 'rgba(217, 119, 6, 0.08)',
                    transform: isMobile ? 'none' : 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ 
                    bgcolor: 'warning.main', 
                    mr: { xs: 1.5, sm: 2 }, 
                    width: { xs: 36, sm: 40 }, 
                    height: { xs: 36, sm: 40 },
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    {person.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        lineHeight: { xs: 1.2, sm: 1.3 }
                      }}
                    >
                      {person.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        lineHeight: { xs: 1.2, sm: 1.3 }
                      }}
                    >
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
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: 'info.dark', 
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              На этой неделе
            </Typography>
            {upcomingBirthdays.map((person) => (
              <Paper 
                key={person.id}
                variant="outlined" 
                sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  mb: { xs: 1.5, sm: 2 },
                  backgroundColor: 'rgba(14, 165, 233, 0.05)',
                  border: '1px solid',
                  borderColor: 'info.light',
                  borderRadius: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    transform: isMobile ? 'none' : 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <Box display="flex" alignItems="center" sx={{ flex: 1, minWidth: 0, mr: { xs: 1, sm: 2 } }}>
                    <Avatar sx={{ 
                      bgcolor: 'info.main', 
                      mr: { xs: 1.5, sm: 2 }, 
                      width: { xs: 36, sm: 40 }, 
                      height: { xs: 36, sm: 40 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}>
                      {person.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          lineHeight: { xs: 1.2, sm: 1.3 }
                        }}
                      >
                        {person.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          lineHeight: { xs: 1.2, sm: 1.3 }
                        }}
                      >
                        {person.position}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={formatDate(person.birthday)}
                    size="small"
                    color="info"
                    sx={{ 
                      borderRadius: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      height: { xs: 24, sm: 28 },
                      mt: { xs: 1, sm: 0 }
                    }}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {birthdays.length === 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            textAlign="center"
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 2, sm: 3 }
            }}
          >
            Нет дней рождения на этой неделе
          </Typography>
        )}
    </Box>
  )
}

export default BirthdayList
