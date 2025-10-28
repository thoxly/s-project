import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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

  const getIcon = (iconName, color = 'primary') => {
    const iconProps = {
      sx: { 
        color: `${color}.main`,
        fontSize: 20,
      }
    }
    
    switch (iconName) {
      case 'Assignment':
        return <AssignmentIcon {...iconProps} />
      case 'LibraryBooks':
        return <LibraryBooksIcon {...iconProps} />
      case 'Business':
        return <BusinessIcon {...iconProps} />
      case 'Person':
        return <PersonIcon {...iconProps} />
      case 'Support':
        return <SupportIcon {...iconProps} />
      case 'Event':
        return <EventIcon {...iconProps} />
      default:
        return <LinkIcon {...iconProps} />
    }
  }

  const handleLinkClick = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={isMobile ? "80px" : "100px"}>
        <Typography variant={isMobile ? "body2" : "body1"}>Загрузка ссылок...</Typography>
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
                startIcon={getIcon(link.icon, link.color)}
                onClick={() => handleLinkClick(link.path)}
                sx={{ 
                  py: { xs: 1.5, sm: 1.5 },
                  px: { xs: 1, sm: 2 },
                  fontWeight: 500,
                  borderRadius: { xs: 1.5, sm: 2 },
                  textTransform: 'none',
                  minHeight: { xs: 70, sm: 80 },
                  borderColor: `${link.color}.main`,
                  color: `${link.color}.main`,
                  '&:hover': {
                    backgroundColor: `${link.color}.main`,
                    color: 'white',
                    transform: isMobile ? 'translateY(-1px)' : 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${link.color === 'primary' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`,
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    }
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box sx={{ 
                  textAlign: 'left', 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: { xs: 0.25, sm: 0.5 }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 0,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: { xs: 1.2, sm: 1.3 }
                    }}
                  >
                    {link.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block', 
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      lineHeight: { xs: 1.2, sm: 1.3 },
                      textAlign: 'left'
                    }}
                  >
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
