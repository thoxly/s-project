import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  AccountTree as OrgIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Главная', path: '/', icon: <DashboardIcon /> },
    { label: 'Профиль', path: '/profile', icon: <PersonIcon /> },
    { label: 'Сервисы', path: '/services', icon: <BusinessIcon /> },
    { label: 'База знаний', path: '/knowledge', icon: <SchoolIcon /> },
    { label: 'Оргструктура', path: '/org', icon: <OrgIcon /> }
  ]

  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
        borderRadius: 0
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 3
              }}
            >
              Portal S
            </Typography>
            <Chip 
              label="v1.0" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 500
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'transparent',
                  color: location.pathname === item.path 
                    ? 'white' 
                    : 'rgba(255,255,255,0.8)',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
