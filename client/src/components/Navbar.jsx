import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tooltip,
  Avatar
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AddBusiness as BusinessIcon,
  School as SchoolIcon,
  AccountTree as OrgIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Главная', path: '/', icon: <DashboardIcon /> },
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
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out'
              }
            }}
            onClick={() => navigate('/')}
          >
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
              Сириус ФТ
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '12px',
              }}
            >
              v1.0
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
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
            
            {/* Правая зона с уведомлениями, статусом и профилем */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2, pl: 2, borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}>
              {/* Статус системы */}
              <Tooltip title="Система работает стабильно" placement="bottom">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    cursor: 'pointer',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              </Tooltip>
              
              {/* Уведомления */}
              <Tooltip title="3 новых уведомления" placement="bottom">
                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                  <NotificationsIcon sx={{ color: 'white', fontSize: 24 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    3
                  </Box>
                </Box>
              </Tooltip>
              
              {/* Профиль */}
              <Tooltip title="Мой профиль" placement="bottom">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'scale(1.1)',
                    }
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <PersonIcon sx={{ fontSize: 20 }} />
                </Avatar>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
