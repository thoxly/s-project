import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon,
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  ViewDay as ViewDayIcon,
  DragIndicator as DragIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'
import { format, startOfWeek, addDays, isToday, isSameDay, parseISO, addHours, addWeeks, subWeeks } from 'date-fns'
import { ru } from 'date-fns/locale'

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
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Импорт хука
import { useBlocksState } from '../../hooks/useBlocksState'

// Draggable компонент для карточек
const DraggableCard = ({ 
  id, 
  children, 
  isEditMode = false,
  gridSize = { xs: 12, md: 8 },
  onToggleWidth,
  width = 1,
  title
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isEditMode 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  }

  const handleWidthToggle = (e) => {
    e.stopPropagation()
    if (onToggleWidth) {
      onToggleWidth(id)
    }
  }

  return (
    <Grid item {...gridSize} ref={setNodeRef} style={style}>
      <Paper 
        sx={{ 
          p: 0,
          borderRadius: 4,
          position: 'relative',
          background: isDragging 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)' 
            : 'white',
          backdropFilter: isDragging ? 'blur(10px)' : 'none',
          boxShadow: isDragging 
            ? "0 20px 40px rgba(30, 58, 138, 0.3), 0 0 0 2px rgba(30, 58, 138, 0.2)" 
            : "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
          opacity: isDragging ? 0.95 : 1,
          scale: isDragging ? '1.03' : '1',
          transition: isDragging 
            ? 'box-shadow 200ms ease, opacity 200ms ease, scale 200ms ease' 
            : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
          '&:hover': {
            boxShadow: isEditMode 
              ? "0 8px 24px rgba(30, 58, 138, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)"
              : "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {/* Заголовок блока с drag handle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2.5,
            pt: 3,
            background: isDragging 
              ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 64, 175, 0.03) 100%)'
              : 'transparent',
            cursor: isEditMode ? 'grab' : 'default',
            '&:active': {
              cursor: isEditMode ? 'grabbing' : 'default'
            },
            transition: 'background 200ms ease',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
          {...(isEditMode ? { ...attributes, ...listeners } : {})}
        >
          {/* Drag handle - только в режиме редактирования */}
          {isEditMode && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                p: 1,
                borderRadius: 2,
                color: 'text.secondary',
                backgroundColor: 'rgba(30, 58, 138, 0.08)',
                transition: 'all 200ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(30, 58, 138, 0.15)',
                  color: 'primary.main',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <DragIcon />
            </Box>
          )}

          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              flex: 1,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>

          {/* Кнопка изменения ширины - только в режиме редактирования */}
          {isEditMode && (
            <Tooltip title={width === 2 ? "Стандартная ширина" : "Двойная ширина"}>
              <IconButton
                onClick={handleWidthToggle}
                size="small"
                sx={{
                  color: width === 2 ? 'primary.main' : 'text.secondary',
                  backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.1)' : 'transparent',
                  borderRadius: 2,
                  transition: 'all 200ms ease',
                  '&:hover': {
                    backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                {width === 2 ? <ViewDayIcon fontSize="small" /> : <ViewColumnIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {/* Содержимое блока */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Paper>
    </Grid>
  )
}

const CalendarTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [addMeetingDialog, setAddMeetingDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeId, setActiveId] = useState(null)

  // Начальная конфигурация блоков
  const defaultBlocks = [
    { 
      id: 'calendar', 
      title: 'Календарь встреч',
      type: 'calendar',
      gridSize: { xs: 12, md: 8 },
      width: 1,
      order: 0
    },
    { 
      id: 'upcoming', 
      title: 'Предстоящие встречи',
      type: 'upcoming',
      gridSize: { xs: 12, md: 4 },
      width: 1,
      order: 1
    }
  ]

  // Используем хук для управления состоянием блоков
  const { blocks, toggleBlockWidth, reorderBlocks, resetToDefault } = useBlocksState('calendar', defaultBlocks)

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: 30,
    type: 'meeting',
    participants: [],
    location: '',
    online: false
  })

  // Датчики для drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  // Тестовые данные встреч
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Еженедельный стендап команды',
      date: format(addHours(new Date().setHours(10, 0, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 30,
      type: 'meeting',
      participants: ['Иванов И.И.', 'Петров П.П.', 'Сидорова С.С.', 'Кузнецов Д.С.'],
      location: 'Конференц-зал А',
      online: false
    },
    {
      id: 2,
      title: 'Обсуждение проекта Portal-S',
      date: format(addHours(new Date().setHours(14, 0, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 60,
      type: 'project',
      participants: ['Иванов И.И.', 'Смирнов А.В.'],
      location: 'Zoom',
      online: true
    },
    {
      id: 3,
      title: 'Презентация новых фич системы',
      date: format(addHours(addDays(new Date(), 1).setHours(11, 30, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 45,
      type: 'presentation',
      participants: ['Все отделы разработки'],
      location: 'Актовый зал',
      online: false
    },
    {
      id: 4,
      title: 'Индивидуальная встреча с руководителем',
      date: format(addHours(addDays(new Date(), 2).setHours(16, 0, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 30,
      type: 'one-on-one',
      participants: ['Иванов И.И.', 'Кузнецов Д.С.'],
      location: 'Кабинет 305',
      online: false
    },
    {
      id: 5,
      title: 'Планирование следующего спринта',
      date: format(addHours(addWeeks(new Date(), 1).setHours(11, 0, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 90,
      type: 'planning',
      participants: ['Иванов И.И.', 'Петров П.П.', 'Сидорova С.С.'],
      location: 'Комната переговоров Б',
      online: false
    },
    {
      id: 6,
      title: 'Обзор результатов квартала',
      date: format(addHours(addWeeks(new Date(), 2).setHours(15, 0, 0, 0), 0), "yyyy-MM-dd'T'HH:mm"),
      duration: 120,
      type: 'presentation',
      participants: ['Все отделы'],
      location: 'Актовый зал',
      online: false
    }
  ])

  // Функция для получения gridSize с учетом ширины
  const getGridSize = (block) => {
    // Если ширина полная, всегда 12 колонок
    if (block.width === 2) {
      return { xs: 12, md: 12 }
    }
    
    // Используем сохраненный gridSize или вычисляем по умолчанию
    return block.gridSize
  }

  // Обработчики drag and drop для блоков
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex)
      }
    }
    
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // Навигация по неделям
  const goToPreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1))
  }

  const goToNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Получаем дни недели
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  // Встречи на выбранный день
  const dayMeetings = meetings.filter(meeting => 
    isSameDay(parseISO(meeting.date), selectedDate)
  ).sort((a, b) => parseISO(a.date) - parseISO(b.date))

  // Предстоящие встречи
  const upcomingMeetings = meetings
    .filter(meeting => parseISO(meeting.date) > new Date())
    .sort((a, b) => parseISO(a.date) - parseISO(b.date))
    .slice(0, 5)

  const getMeetingColor = (type) => {
    const colors = {
      meeting: 'primary',
      project: 'success',
      presentation: 'warning',
      'one-on-one': 'info',
      planning: 'secondary'
    }
    return colors[type] || 'default'
  }

  const getMeetingIcon = (type, online) => {
    if (online) return <VideoCallIcon />
    
    const icons = {
      meeting: <GroupsIcon />,
      project: <EventIcon />,
      presentation: <EventIcon />,
      'one-on-one': <PersonIcon />,
      planning: <EventIcon />
    }
    return icons[type] || <EventIcon />
  }

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim()) return

    const meeting = {
      id: Date.now(),
      ...newMeeting,
      participants: newMeeting.participants.length > 0 ? 
        newMeeting.participants : ['Иванов И.И.']
    }

    setMeetings(prev => [...prev, meeting])
    setAddMeetingDialog(false)
    setNewMeeting({
      title: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration: 30,
      type: 'meeting',
      participants: [],
      location: '',
      online: false
    })
  }

  const handleDeleteMeeting = (id, e) => {
    e?.stopPropagation()
    setMeetings(prev => prev.filter(meeting => meeting.id !== id))
  }

  const meetingTypes = [
    { value: 'meeting', label: 'Совещание' },
    { value: 'project', label: 'Проект' },
    { value: 'presentation', label: 'Презентация' },
    { value: 'one-on-one', label: '1 на 1' },
    { value: 'planning', label: 'Планирование' }
  ]

  const locations = [
    'Конференц-зал А',
    'Конференц-зал Б',
    'Комната переговоров А',
    'Комната переговоров Б',
    'Кабинет 305',
    'Актовый зал',
    'Zoom',
    'Microsoft Teams'
  ]

  // Рендер содержимого блоков
  const renderBlockContent = (block) => {
    switch (block.type) {
      case 'calendar':
        return (
          <>
            {/* Заголовок календаря с навигацией */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', flex: 1 }}>
                {format(weekStart, 'MMMM yyyy', { locale: ru })}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Предыдущая неделя">
                  <IconButton 
                    onClick={goToPreviousWeek}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Сегодня">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={goToToday}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 'auto',
                      px: 2
                    }}
                  >
                    Сегодня
                  </Button>
                </Tooltip>

                <Tooltip title="Следующая неделя">
                  <IconButton 
                    onClick={goToNextWeek}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Дни недели */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {weekDays.map(day => (
                <Grid item xs={block.width === 2 ? 12/7 : true} key={day}>
                  <Card 
                    onClick={() => setSelectedDate(day)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      backgroundColor: isSameDay(day, selectedDate) ? 'primary.main' : 
                                     isToday(day) ? 'primary.light' : 'background.default',
                      color: isSameDay(day, selectedDate) ? 'white' : 'text.primary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {format(day, 'EEE', { locale: ru })}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {format(day, 'd')}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.7,
                        color: isSameDay(day, selectedDate) ? 'white' : 'text.secondary'
                      }}>
                        {meetings.filter(m => isSameDay(parseISO(m.date), day)).length} встреч
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Список встреч на день */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Встречи на {format(selectedDate, 'd MMMM', { locale: ru })}
              </Typography>
              
              {dayMeetings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    На этот день встреч не запланировано
                  </Typography>
                </Box>
              ) : (
                <List>
                  {dayMeetings.map((meeting, index) => (
                    <React.Fragment key={meeting.id}>
                      <ListItem 
                        sx={{ 
                          borderRadius: 3,
                          mb: 1,
                          backgroundColor: 'background.default',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon>
                          {getMeetingIcon(meeting.type, meeting.online)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                                {meeting.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={format(parseISO(meeting.date), 'HH:mm')}
                                  size="small"
                                  color={getMeetingColor(meeting.type)}
                                />
                                <Tooltip title="Удалить встречу">
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => handleDeleteMeeting(meeting.id, e)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {meeting.duration} мин • 
                                </Typography>
                                <RoomIcon sx={{ fontSize: 16, ml: 1, mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {meeting.location}
                                </Typography>
                                {meeting.online && (
                                  <Chip 
                                    label="Онлайн" 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ ml: 1, height: 20 }}
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {meeting.participants.join(', ')}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dayMeetings.length - 1 && <Divider variant="inset" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </>
        )

      case 'upcoming':
        return (
          <>
            {upcomingMeetings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Нет предстоящих встреч
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: block.width === 2 ? 300 : 500, overflow: 'auto' }}>
                {upcomingMeetings.map((meeting, index) => (
                  <React.Fragment key={meeting.id}>
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
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getMeetingIcon(meeting.type, meeting.online)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {meeting.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {format(parseISO(meeting.date), 'd MMM, HH:mm', { locale: ru })}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              <Chip 
                                label={meeting.location}
                                size="small"
                                variant="outlined"
                              />
                              {meeting.online && (
                                <Chip 
                                  label="Онлайн" 
                                  size="small" 
                                  variant="outlined"
                                  color="primary"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingMeetings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )

      default:
        return null
    }
  }

  const activeBlock = activeId ? blocks.find(b => b.id === activeId) : null

  return (
    <Box>
      {/* Заголовок и кнопки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Календарь
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Расписание встреч и мероприятий
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Кнопка добавления встречи */}
          <Tooltip title="Добавить встречу">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddMeetingDialog(true)}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Новая встреча
            </Button>
          </Tooltip>

          {/* Кнопка настроек (режим редактирования) */}
          <Tooltip title={isEditMode ? "Выйти из режима редактирования" : "Настроить расположение блоков"}>
            <Fab
              size="small"
              color={isEditMode ? "primary" : "default"}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <SettingsIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>

      {/* Контент календаря */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={blocks.map(block => block.id)} strategy={horizontalListSortingStrategy}>
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
                {blocks.map((block) => (
                  <DraggableCard
                    key={block.id}
                    id={block.id}
                    isEditMode={isEditMode}
                    gridSize={getGridSize(block)}
                    onToggleWidth={toggleBlockWidth}
                    width={block.width}
                    title={block.title}
                  >
                    {renderBlockContent(block)}
                  </DraggableCard>
                ))}
              </Grid>
            </Box>
          </SortableContext>
          
          <DragOverlay>
            {activeBlock ? (
              <Box sx={{ width: 360, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3, p: 2 }}>
                <Typography variant="h6">{activeBlock.title}</Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Grid container spacing={3}>
          {blocks.map((block) => (
            <Grid item {...getGridSize(block)} key={block.id}>
              <Paper 
                sx={{ 
                  p: 0, 
                  borderRadius: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Заголовок блока в обычном режиме */}
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {block.title}
                  </Typography>
                </Box>
                <Box sx={{ p: 3, flex: 1 }}>
                  {renderBlockContent(block)}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Кнопка сброса настроек (только в режиме редактирования) */}
      {isEditMode && (
        <Tooltip title="Сбросить расположение блоков">
          <Fab
            color="secondary"
            onClick={resetToDefault}
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Диалог добавления встречи */}
      <Dialog 
        open={addMeetingDialog} 
        onClose={() => setAddMeetingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить новую встречу</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Название встречи"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label="Дата и время"
              type="datetime-local"
              value={newMeeting.date}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Тип встречи</InputLabel>
              <Select
                value={newMeeting.type}
                label="Тип встречи"
                onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value }))}
              >
                {meetingTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Продолжительность (минуты)"
              type="number"
              value={newMeeting.duration}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Место проведения</InputLabel>
              <Select
                value={newMeeting.location}
                label="Место проведения"
                onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
              >
                {locations.map(location => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newMeeting.online}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, online: e.target.checked }))}
                />
              }
              label="Онлайн встреча"
            />

            <TextField
              label="Участники (через запятую)"
              placeholder="Иванов И.И., Петров П.П."
              value={newMeeting.participants.join(', ')}
              onChange={(e) => setNewMeeting(prev => ({ 
                ...prev, 
                participants: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
              }))}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMeetingDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleAddMeeting} 
            variant="contained"
            disabled={!newMeeting.title.trim() || !newMeeting.location}
          >
            Добавить встречу
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CalendarTab