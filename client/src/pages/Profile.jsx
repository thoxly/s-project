import React from 'react'
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Fade
} from '@mui/material'
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
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
import Breadcrumbs from "../components/Breadcrumbs";

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Обновляем document.title при смене вкладки
  React.useEffect(() => {
    const tabTitle = getTabTitle(activeTab)
    if (activeTab === 'profile') {
      document.title = 'Portal S'
    } else {
      document.title = `${tabTitle} — Portal S`
    }
  }, [activeTab])

  const getTabTitle = (tabId) => {
    const tab = tabs.find(t => t.id === tabId)
    return tab ? tab.label : 'Профиль'
  }

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
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        {/* Заголовок страницы */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.1) 0%, rgba(30, 60, 147, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgb(30, 60, 147) 0%, rgb(45, 85, 180) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {getTabTitle(activeTab)}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Личный кабинет и рабочие инструменты
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Табы */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                px: 3,
                '&.Mui-selected': {
                  fontWeight: 600,
                  color: 'primary.main'
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: 'primary.main'
              }
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Контент вкладки */}
        <Box>
          {renderActiveTab()}
        </Box>
      </Container>
    </Box>
  )
}

export default Profile