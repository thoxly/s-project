import React from 'react'
import {
  Grid,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  Container,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Zoom,
  CircularProgress
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

// Импорт компонентов
import NewsFeed from '../components/NewsFeed'
import EventCarousel from '../components/EventCarousel'
import BirthdayList from '../components/BirthdayList'
import QuickLinks from '../components/QuickLinks'
import DraggableCard from '../components/DraggableCard'
import { useDashboardState } from '../hooks/useDashboardState.jsx'

const Dashboard = () => {
  const navigate = useNavigate()
  const { widgets, isLoading, isEditMode, reorderWidgets, toggleWidgetWidth, toggleEditMode, resetToDefault, getIconComponent } = useDashboardState()
  const [activeId, setActiveId] = React.useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Требуем перемещение на 8px перед началом drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Обработчики drag-and-drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((item) => item.id === active.id)
      const newIndex = widgets.findIndex((item) => item.id === over.id)
      
      reorderWidgets(oldIndex, newIndex)
    }
    
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // Находим активный виджет для DragOverlay
  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null

  // Функция для рендеринга содержимого виджетов
  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'news':
        return <NewsFeed />
      case 'events':
        return <EventCarousel />
      case 'birthdays':
        return <BirthdayList />
      case 'quicklinks':
        return <QuickLinks />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.03) 0%, rgba(30, 64, 175, 0.01) 100%)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            mb: 3,
          }}
        >
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              С
            </Avatar>
          </Box>
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Загрузка Portal S
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Подготавливаем дашборд...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header с логотипом и приветствием */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: { xs: 1, md: 2 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 0 } }}>
            <Box display="flex" alignItems="center" flexGrow={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Zoom in={true} timeout={600}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main', 
                    mr: 2, 
                    width: { xs: 40, md: 48 }, 
                    height: { xs: 40, md: 48 },
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 300ms ease',
                    '&:hover': {
                      transform: 'rotate(10deg) scale(1.1)',
                    }
                  }}
                >
                  С
                </Avatar>
              </Zoom>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    fontSize: { xs: '1.5rem', md: '2.125rem' },
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Добро пожаловать в Portal S 🚀
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: { xs: '0.875rem', md: '1.25rem' },
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Корпоративный портал с интеграцией ELMA365
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Система работает стабильно" 
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': { color: 'white' },
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 500,
                  transition: 'all 300ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                  }
                }}
              />
              <Chip 
                icon={<NotificationsIcon />} 
                label="3 новых уведомления" 
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-icon': { color: 'white' },
                  fontWeight: 500,
                  transition: 'all 300ms ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/profile')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 300ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.35)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Профиль
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Основной контент */}
      <Container maxWidth="xl">
        {/* Кнопка настроек справа сверху */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title={isEditMode ? "Выйти из режима редактирования" : "Настроить дашборд"} placement="left">
            <Fab
              size="small"
              color={isEditMode ? "primary" : "default"}
              onClick={toggleEditMode}
              sx={{
                boxShadow: isEditMode 
                  ? '0 4px 12px rgba(30, 58, 138, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 300ms ease',
                backgroundColor: isEditMode ? 'primary.main' : 'white',
                '&:hover': {
                  transform: 'scale(1.1) rotate(90deg)',
                  boxShadow: '0 6px 16px rgba(30, 58, 138, 0.5)',
                }
              }}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
            </Fab>
          </Tooltip>
        </Box>

        {isEditMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
              <Box
                sx={{
                  minHeight: 400,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)',
                  border: '3px dashed',
                  borderColor: activeId ? 'primary.main' : 'primary.light',
                  p: 3,
                  transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: activeId 
                      ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 64, 175, 0.03) 100%)'
                      : 'transparent',
                    transition: 'background 300ms ease',
                    pointerEvents: 'none',
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    gap: 2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
                    }}
                  >
                    <SettingsIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Режим редактирования • Перетаскивайте блоки
                  </Typography>
                </Box>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {widgets.map((widget, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      md={widget.width === 2 ? 12 : 6} 
                      lg={widget.width === 2 ? 8 : 4} 
                      key={widget.id}
                    >
                      <DraggableCard
                        id={widget.id}
                        index={index}
                        title={widget.title}
                        icon={getIconComponent(widget.iconName)}
                        color={widget.color}
                        onToggleWidth={toggleWidgetWidth}
                        width={widget.width}
                        isEditMode={isEditMode}
                      >
                        {renderWidgetContent(widget.id)}
                      </DraggableCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </SortableContext>
            
            {/* DragOverlay для плавного перетаскивания */}
            <DragOverlay
              dropAnimation={{
                duration: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {activeWidget ? (
                <Card
                  sx={{
                    width: 360,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: "0 24px 48px rgba(30, 58, 138, 0.35), 0 0 0 3px rgba(30, 58, 138, 0.2)",
                    transform: 'rotate(3deg) scale(1.05)',
                    cursor: 'grabbing',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${activeWidget.color}.main, ${activeWidget.color}.light)`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${activeWidget.color}.main`,
                          background: `linear-gradient(135deg, ${activeWidget.color}.main 0%, ${activeWidget.color}.dark 100%)`,
                          mr: 2,
                          width: 42,
                          height: 42,
                          boxShadow: `0 4px 12px ${activeWidget.color === 'primary' ? 'rgba(30, 58, 138, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`,
                        }}
                      >
                        {getIconComponent(activeWidget.iconName)}
                      </Avatar>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {activeWidget.title}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <Box
            sx={{
              minHeight: 400,
              borderRadius: 2,
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {widgets.map((widget, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={widget.width === 2 ? 12 : 6} 
                  lg={widget.width === 2 ? 8 : 4} 
                  key={widget.id}
                >
                  <Zoom in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                    <div>
                      <DraggableCard
                        id={widget.id}
                        index={index}
                        title={widget.title}
                        icon={getIconComponent(widget.iconName)}
                        color={widget.color}
                        onToggleWidth={toggleWidgetWidth}
                        width={widget.width}
                        isEditMode={isEditMode}
                      >
                        {renderWidgetContent(widget.id)}
                      </DraggableCard>
                    </div>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Floating Action Button для сброса настроек - только в режиме редактирования */}
      {isEditMode && (
        <Zoom in={isEditMode} timeout={400}>
          <Tooltip title="Сбросить расположение блоков" placement="left">
            <Fab
              color="secondary"
              aria-label="reset"
              onClick={resetToDefault}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
                transition: 'all 300ms ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(180deg)',
                  boxShadow: '0 12px 32px rgba(5, 150, 105, 0.5)',
                  background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                },
                '&:active': {
                  transform: 'scale(0.95) rotate(180deg)',
                }
              }}
            >
              <RefreshIcon sx={{ fontSize: 28 }} />
            </Fab>
          </Tooltip>
        </Zoom>
      )}
    </Box>
  )
}

export default Dashboard
