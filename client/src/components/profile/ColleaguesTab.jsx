import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Fab,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Zoom
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  ViewDay as ViewDayIcon,
  ViewComfy as ViewComfyIcon,
  DragIndicator as DragIcon,
  SupervisorAccount as SupervisorIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Group as GroupIcon
} from '@mui/icons-material'

// Импорты для drag and drop
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
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

import DraggableCard from '../DraggableCard'
import { useColleaguesState } from '../../hooks/useColleaguesState'

// Компонент блока руководителя
const SupervisorBlock = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const supervisor = {
    name: "Петров Петр Петрович",
    position: "Руководитель отдела разработки",
    department: "IT-отдел",
    phone: "+7 (495) 123-45-67",
    email: "p.petrov@company.ru",
    avatar: "ПП"
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setMessageText('')
  }

  const handleSendMessage = () => {
    console.log('Отправка сообщения:', {
      to: supervisor.name,
      text: messageText,
      email: supervisor.email
    })
    
    setSnackbarOpen(true)
    handleCloseDialog()
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Box>
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        transition: 'all 300ms ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: 'info.main',
                fontSize: '1.5rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(2, 136, 209, 0.3)'
              }}
            >
              {supervisor.avatar}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
              {supervisor.name}
            </Typography>
            <Chip 
              label={supervisor.position} 
              color="info" 
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {supervisor.department}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {supervisor.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {supervisor.email}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<MessageIcon />}
            fullWidth
            onClick={handleOpenDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(2, 136, 209, 0.4)'
              }
            }}
          >
            Написать сообщение
          </Button>
        </CardContent>
      </Card>

      {/* Диалог отправки сообщения */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Написать сообщение
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Получатель:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'info.main',
                  fontSize: '0.9rem'
                }}
              >
                {supervisor.avatar}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  {supervisor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {supervisor.position}
                </Typography>
              </Box>
            </Box>
          </Box>

          <TextField
            label="Текст сообщения"
            multiline
            rows={4}
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите ваше сообщение..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0277bd 0%, #01579b 100%)',
              }
            }}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомление об успешной отправке */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          Сообщение отправлено {supervisor.name}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Компонент блока всех коллег
const AllColleaguesBlock = () => {
  const colleagues = [
    {
      id: 1,
      name: "Иванова Анна Сергеевна",
      position: "Старший разработчик",
      department: "IT-отдел",
      email: "a.ivanova@company.ru",
      avatar: "АИ",
      status: "online"
    },
    {
      id: 2,
      name: "Сидоров Михаил Владимирович",
      position: "Frontend разработчик",
      department: "IT-отдел",
      email: "m.sidorov@company.ru",
      avatar: "МС",
      status: "away"
    },
    {
      id: 3,
      name: "Козлова Елена Дмитриевна",
      position: "UI/UX дизайнер",
      department: "Дизайн-отдел",
      email: "e.kozlova@company.ru",
      avatar: "ЕК",
      status: "online"
    },
    {
      id: 4,
      name: "Николаев Алексей Петрович",
      position: "Backend разработчик",
      department: "IT-отдел",
      email: "a.nikolaev@company.ru",
      avatar: "АН",
      status: "offline"
    },
    {
      id: 5,
      name: "Воробьева Ольга Игоревна",
      position: "Менеджер проектов",
      department: "Отдел управления",
      email: "o.vorobeva@company.ru",
      avatar: "ОВ",
      status: "online"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success.main'
      case 'away': return 'warning.main'
      case 'offline': return 'text.disabled'
      default: return 'text.disabled'
    }
  }

  return (
    <Box>
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {colleagues.map((colleague, index) => (
          <React.Fragment key={colleague.id}>
            <ListItem 
              sx={{ 
                px: 0,
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    position: 'relative'
                  }}
                >
                  {colleague.avatar}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      backgroundColor: getStatusColor(colleague.status),
                      border: '2px solid white',
                      borderRadius: '50%'
                    }}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {colleague.name}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {colleague.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {colleague.department} • {colleague.email}
                    </Typography>
                  </Box>
                }
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<MessageIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: 'auto'
                }}
              >
                Написать
              </Button>
            </ListItem>
            {index < colleagues.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}

const ColleaguesTab = () => {
  const { widgets, isEditMode, reorderWidgets, toggleWidgetWidth, toggleEditMode, resetToDefault } = useColleaguesState()
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

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

  // Функция для определения ширины блока в колонках Grid
  const getGridWidth = (width) => {
    switch (width) {
      case 'full': return 12
      case 'half': return 8  
      case 'third': return 4
      default: return 8
    }
  }

  // Функция для преобразования ширины в числовое значение для DraggableCard
  const getCardWidth = (width) => {
    switch (width) {
      case 'full': return 2
      case 'half': return 2  
      case 'third': return 1
      default: return 2
    }
  }

  // Функция для получения иконки по типу
  const getWidgetIcon = (iconType) => {
    switch (iconType) {
      case 'supervisor': return <SupervisorIcon />
      case 'group': return <GroupIcon />
      default: return <GroupIcon />
    }
  }

  // Рендер содержимого блоков
  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'supervisor':
        return <SupervisorBlock />
      case 'all-colleagues':
        return <AllColleaguesBlock />
      default:
        return null
    }
  }

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null

  return (
    <Box>
      {/* Заголовок и кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Контакты руководителя и сотрудников
          </Typography>
        </Box>
        
        <Tooltip title={isEditMode ? "Выйти из режима редактирования" : "Настроить расположение блоков"}>
          <Fab
            size="small"
            color={isEditMode ? "primary" : "default"}
            onClick={toggleEditMode}
          >
            <SettingsIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Контент вкладки коллег */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <Box
              sx={{
                minHeight: 400,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)',
                border: '3px dashed',
                borderColor: activeId ? 'primary.main' : 'primary.light',
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: 'primary.main' }}>
                Режим редактирования • Перетаскивайте блоки за заголовок и меняйте ширину
              </Typography>
              
              <Grid container spacing={3}>
                {widgets.map((widget, index) => (
                  <Grid item xs={12} md={getGridWidth(widget.width)} key={widget.id}>
                    <DraggableCard
                      id={widget.id}
                      index={index}
                      title={widget.title}
                      icon={getWidgetIcon(widget.icon)}
                      color={widget.color}
                      onToggleWidth={() => toggleWidgetWidth(widget.id)}
                      width={getCardWidth(widget.width)}
                      isEditMode={isEditMode}
                    >
                      {renderWidgetContent(widget.id)}
                    </DraggableCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SortableContext>
          
          <DragOverlay>
            {activeWidget ? (
              <Box sx={{ width: 360, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3, p: 2 }}>
                <Typography variant="h6">{activeWidget.title}</Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Grid container spacing={3}>
          {widgets.map((widget, index) => (
            <Grid item xs={12} md={getGridWidth(widget.width)} key={widget.id}>
              <Zoom in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <div>
                  <DraggableCard
                    id={widget.id}
                    index={index}
                    title={widget.title}
                    icon={getWidgetIcon(widget.icon)}
                    color={widget.color}
                    onToggleWidth={() => toggleWidgetWidth(widget.id)}
                    width={getCardWidth(widget.width)}
                    isEditMode={isEditMode}
                  >
                    {renderWidgetContent(widget.id)}
                  </DraggableCard>
                </div>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Кнопка сброса настроек (только в режиме редактирования) */}
      {isEditMode && (
        <Zoom in={isEditMode}>
          <Tooltip title="Сбросить расположение блоков">
            <Fab
              color="secondary"
              onClick={resetToDefault}
              sx={{ position: 'fixed', bottom: 24, right: 24 }}
            >
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      )}
    </Box>
  )
}

export default ColleaguesTab