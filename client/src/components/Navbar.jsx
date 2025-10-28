import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AddBusiness as BusinessIcon,
  School as SchoolIcon,
  AccountTree as OrgIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { label: 'Главная', path: '/', icon: <DashboardIcon /> },
    { label: 'Профиль', path: '/profile', icon: <PersonIcon /> },
    { label: 'Сервисы', path: '/services', icon: <BusinessIcon /> },
    { label: 'База знаний', path: '/knowledge', icon: <SchoolIcon /> },
    { label: 'Оргструктура', path: '/org', icon: <OrgIcon /> }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Portal S
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(30, 58, 138, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.15)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
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
                  mr: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
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
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'flex' }
                }} 
              />
            </Box>
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
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

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'block', md: 'none' }, ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar
