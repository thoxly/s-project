import React from 'react'
import {
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Button
} from '@mui/material'
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Apps as AppsIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Task as TaskIcon
} from '@mui/icons-material'

// Импорт компонентов вкладок
import ProfileTab from "../components/profile/ProfileTab";
import ApplicationsTab from "../components/profile/ApplicationsTab";
import MessengerTab from "../components/profile/MessengerTab";
import CalendarTab from "../components/profile/CalendarTab";
import TasksTab from "../components/profile/TasksTab";
import IdeasTab from "../components/profile/IdeasTab";
import ColleaguesTab from "../components/profile/ColleaguesTab";

const Profile = () => {
  const [activeTab, setActiveTab] = React.useState('profile')

   const tabs = [
    { id: 'profile', label: 'Профиль', icon: <PersonIcon /> },
    { id: 'tasks', label: 'Задачи', icon: <TaskIcon /> },
    { id: 'calendar', label: 'Календарь', icon: <CalendarIcon /> },
    { id: 'messenger', label: 'Мессенджер', icon: <MessageIcon /> },
    { id: 'applications', label: 'Заявки', icon: <AssignmentIcon /> },
    { id: 'colleagues', label: 'Коллеги', icon: <GroupIcon /> },
    { id: 'ideas', label: 'Идеи', icon: <LightbulbIcon /> },
  ]

 

  const drawerWidth = 280

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'applications':
        return <ApplicationsTab />
      case 'messenger':
        return <MessengerTab />
      case 'calendar':
        return <CalendarTab />
      case 'colleagues':
        return <ColleaguesTab />
      case 'tasks':
        return <TasksTab />
      case 'ideas':
        return <IdeasTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Боковое меню - убираем скругление только у контейнера */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 0, // Убираем скругление только у всего меню
          },
        }}
      >
        {/* Заголовок меню */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 2,
              mx: 'auto',
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '1.8rem',
              fontWeight: 700,
            }}
          >
            С
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
            Портал С
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
            Корпоративный портал
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Навигация - оставляем скругление у кнопок */}
        <List sx={{ p: 2 }}>
          {tabs.map((tab) => (
            <ListItem key={tab.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  borderRadius: 2, // Оставляем скругление у кнопок
                  py: 1.5,
                  backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                  {tab.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tab.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}
                />
                {activeTab === tab.id && (
                  <Box sx={{ width: 4, height: 24, backgroundColor: 'white', borderRadius: 2, ml: 1 }} /> // Оставляем скругление у индикатора
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 2 }} />

        {/* Информация о пользователе */}
        <Box sx={{ p: 3, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                Иванов И.И.
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Ведущий разработчик
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: 2, // Оставляем скругление у кнопки выхода
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Выйти
          </Button>
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }, py: 2 }}>
          {renderActiveTab()}
        </Container>
      </Box>
    </Box>
  )
}

export default Profile