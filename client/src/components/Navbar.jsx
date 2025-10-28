import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tooltip,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  SwipeableDrawer
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AddBusiness as BusinessIcon,
  School as SchoolIcon,
  AccountTree as OrgIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import NotificationsDropdown from './NotificationsDropdown'
import useTouchGestures from '../hooks/useTouchGestures'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3) // Начальное значение
  
  // Сенсорные жесты
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    handleSwipe,
    touchHandlers
  } = useTouchGestures()

  const menuItems = [
    { label: 'Главная', path: '/', icon: <DashboardIcon /> },
    { label: 'Сервисы', path: '/services', icon: <BusinessIcon /> },
    { label: 'База знаний', path: '/knowledge', icon: <SchoolIcon /> },
    { label: 'Оргструктура', path: '/org', icon: <OrgIcon /> }
  ]

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    // Вибрация для мобильных устройств
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileMenuOpen(false)
      // Вибрация при навигации
      if ('vibrate' in navigator) {
        navigator.vibrate(30)
      }
    }
  }

  // Обработка свайпов для мобильного меню
  const handleSwipeGesture = (direction) => {
    if (isMobile) {
      if (direction === 'right' && !mobileMenuOpen) {
        setMobileMenuOpen(true)
      } else if (direction === 'left' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }

  // Обработка свайпов для уведомлений
  const handleNotificationSwipe = (direction) => {
    if (isMobile && notificationsOpen) {
      if (direction === 'left') {
        setNotificationsOpen(false)
      }
    }
  }

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          mb: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
          borderRadius: 0
        }}
        {...(isMobile ? touchHandlers : {})}
        onTouchEnd={(e) => {
          onTouchEnd(e)
          handleSwipe(handleSwipeGesture)
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 56, md: 64 } }}>
            {/* Логотип */}
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
                variant={isMobile ? "h6" : "h5"}
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: { xs: 1, md: 3 }
                }}
              >
                Сириус ФТ
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '12px',
                  }}
                >
                  v1.0
                </Typography>
              )}
            </Box>
            
            {/* Десктопная навигация */}
            {!isMobile && (
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
              </Box>
            )}
            
            {/* Правая зона с уведомлениями, статусом и профилем */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, md: 1 }, 
              alignItems: 'center', 
              ml: { xs: 1, md: 2 }, 
              pl: { xs: 0, md: 2 }, 
              borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.2)' }
            }}>
              {/* Статус системы - только для десктопа */}
              {!isMobile && (
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
              )}
              
              {/* Уведомления */}
              <Tooltip title="Уведомления" placement="bottom">
                <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                  <NotificationsIcon 
                    sx={{ 
                      color: 'white', 
                      fontSize: { xs: 20, md: 24 },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  />
                  {unreadCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: { xs: 16, md: 18 },
                        height: { xs: 16, md: 18 },
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '9px', md: '10px' },
                        fontWeight: 600,
                      }}
                    >
                      {unreadCount}
                    </Box>
                  )}
                  <NotificationsDropdown 
                    open={notificationsOpen} 
                    onClose={() => setNotificationsOpen(false)}
                    onUnreadCountChange={setUnreadCount}
                    isMobile={isMobile}
                  />
                </Box>
              </Tooltip>
              
              {/* Профиль */}
              <Tooltip title="Мой профиль" placement="bottom">
                <Avatar
                  sx={{
                    width: { xs: 32, md: 36 },
                    height: { xs: 32, md: 36 },
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
                  <PersonIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                </Avatar>
              </Tooltip>

              {/* Мобильное меню */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenuToggle}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Мобильное меню */}
      <SwipeableDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        onOpen={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white'
          }
        }}
        {...(isMobile ? touchHandlers : {})}
        onTouchEnd={(e) => {
          onTouchEnd(e)
          handleSwipe(handleSwipeGesture)
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Меню
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={handleMobileMenuClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    color: 'white'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default Navbar
