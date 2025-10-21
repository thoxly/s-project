import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton
} from '@mui/material'
import {
  Event as EventIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'
import EventCard from './EventCard'

const EventCarousel = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/mock/events.json')
      .then(response => response.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Ошибка загрузки событий:', error)
        setLoading(false)
      })
  }, [])

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(events.length - 1, prev + 1))
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <Typography>Загрузка событий...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
          <Box display="flex" gap={1}>
            <IconButton 
              size="small" 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              sx={{
                '&:hover': {
                  backgroundColor: 'secondary.main',
                  color: 'white'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleNext}
              disabled={currentIndex >= events.length - 1}
              sx={{
                '&:hover': {
                  backgroundColor: 'secondary.main',
                  color: 'white'
                }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ overflow: 'hidden' }}>
          <Box 
            sx={{ 
              display: 'flex',
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {events.map((event) => (
              <Box key={event.id} sx={{ minWidth: '100%', pr: { xs: 1, sm: 2 } }}>
                <EventCard event={event} />
              </Box>
            ))}
          </Box>
        </Box>

        {events.length > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            {events.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? 'secondary.main' : 'grey.300',
                  mx: 0.5,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        )}
    </Box>
  )
}

export default EventCarousel
