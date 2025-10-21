import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Grid
} from '@mui/material'
import { Link as LinkIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// Импорт иконок Material-UI
import {
  Assignment as AssignmentIcon,
  LibraryBooks as LibraryBooksIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Event as EventIcon
} from '@mui/icons-material'

const QuickLinks = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/mock/quicklinks.json')
      .then(response => response.json())
      .then(data => {
        setLinks(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Ошибка загрузки быстрых ссылок:', error)
        setLoading(false)
      })
  }, [])

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Assignment':
        return <AssignmentIcon />
      case 'LibraryBooks':
        return <LibraryBooksIcon />
      case 'Business':
        return <BusinessIcon />
      case 'Person':
        return <PersonIcon />
      case 'Support':
        return <SupportIcon />
      case 'Event':
        return <EventIcon />
      default:
        return <LinkIcon />
    }
  }

  const handleLinkClick = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <Typography>Загрузка ссылок...</Typography>
      </Box>
    )
  }

  return (
    <Box>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {links.map((link) => (
            <Grid item xs={6} sm={6} key={link.id}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={getIcon(link.icon)}
                onClick={() => handleLinkClick(link.path)}
                sx={{ 
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 1, sm: 2 },
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  minHeight: { xs: 60, sm: 80 },
                  '&:hover': {
                    backgroundColor: `${link.color}.main`,
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {link.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {link.description}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
    </Box>
  )
}

export default QuickLinks
