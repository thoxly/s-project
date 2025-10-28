import React from 'react'
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper
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
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Заголовок страницы */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
        Профиль
      </Typography>

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
    </Box>
  )
}

export default Profile