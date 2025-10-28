import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Fab,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Stack,
  Zoom
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  ViewDay as ViewDayIcon,
  DragIndicator as DragIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Flag as FlagIcon,
  Close as CloseIcon,
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import DraggableCard from '../DraggableCard' // Импортируем тот же DraggableCard
import { useTasksState } from '../../hooks/useTasksState'

// Компонент задачи (без изменений)
const TaskItem = ({ task, onTaskClick, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <PriorityHighIcon />
      case 'medium': return <FlagIcon />
      case 'low': return <FlagIcon />
      default: return <FlagIcon />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'primary'
      case 'pending': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        }
      }}
      onClick={() => onTaskClick(task)}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
            {task.title}
          </Typography>
          <Chip 
            icon={getPriorityIcon(task.priority)}
            label={task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={task.status === 'in-progress' ? 'В работе' : task.status === 'pending' ? 'Ожидает' : 'Завершена'}
              color={getStatusColor(task.status)}
              variant="outlined"
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {task.dueDate}
            </Typography>
          </Box>

          {task.status !== 'completed' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={(e) => {
                e.stopPropagation()
                onComplete(task.id)
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Выполнить
            </Button>
          )}
        </Box>

        {task.progress > 0 && task.status !== 'completed' && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={task.progress} 
              sx={{ borderRadius: 1, height: 6 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Прогресс: {task.progress}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Компонент блока активных задач (без изменений)
const ActiveTasksBlock = ({ tasks, onTaskClick, onComplete }) => {
  const activeTasks = tasks.filter(task => task.status !== 'completed')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  return (
    <Box>
      {/* Статистика */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Card sx={{ p: 2, flex: 1, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {activeTasks.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Активных
            </Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {completedTasks.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Завершено
            </Typography>
          </Card>
        </Stack>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Активные задачи ({activeTasks.length})
        </Typography>
      </Box>

      {/* Список задач */}
      {activeTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Все задачи выполнены!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Новые задачи появятся здесь
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onComplete={onComplete}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

// Компонент блока статистики задач (без изменений)
const TasksStatsBlock = ({ tasks }) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
  const pendingTasks = tasks.filter(task => task.status === 'pending').length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium' && task.status !== 'completed').length
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low' && task.status !== 'completed').length

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Статистика задач
      </Typography>

      {/* Прогресс выполнения */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Общий прогресс
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completionRate} 
          sx={{ 
            borderRadius: 1, 
            height: 8, 
            mb: 1,
            backgroundColor: 'grey.100'
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Выполнено
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {completionRate}%
          </Typography>
        </Box>
      </Card>

      {/* Статистика по статусам */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {inProgressTasks}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              В работе
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3, 
            bgcolor: 'warning.main', 
            color: 'white',
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {pendingTasks}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Ожидают
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ 
            p: 2, 
            textAlign: 'center', 
            borderRadius: 3, 
            bgcolor: 'success.main', 
            color: 'white',
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {completedTasks}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Завершено
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Приоритеты */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Приоритеты задач
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PriorityHighIcon color="error" />
              <Typography variant="body2">Высокий приоритет</Typography>
            </Box>
            <Chip 
              label={highPriorityTasks} 
              color="error" 
              size="small"
              sx={{ minWidth: 40 }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon color="warning" />
              <Typography variant="body2">Средний приоритет</Typography>
            </Box>
            <Chip 
              label={mediumPriorityTasks} 
              color="warning" 
              size="small"
              sx={{ minWidth: 40 }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon color="info" />
              <Typography variant="body2">Низкий приоритет</Typography>
            </Box>
            <Chip 
              label={lowPriorityTasks} 
              color="info" 
              size="small"
              sx={{ minWidth: 40 }}
            />
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}

// Диалог просмотра задачи (без изменений)
const TaskDialog = ({ task, open, onClose, onComplete }) => {
  if (!task) return null

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'primary'
      case 'pending': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {task.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip 
              label={task.priority === 'high' ? 'Высокий приоритет' : task.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
              color={getPriorityColor(task.priority)}
            />
            <Chip 
              label={task.status === 'in-progress' ? 'В работе' : task.status === 'pending' ? 'Ожидает' : 'Завершена'}
              color={getStatusColor(task.status)}
              variant="outlined"
            />
          </Stack>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {task.fullDescription || task.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ScheduleIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Срок выполнения: {task.dueDate}
            </Typography>
          </Box>

          {task.progress > 0 && task.status !== 'completed' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Прогресс выполнения:
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={task.progress} 
                sx={{ borderRadius: 1, height: 8 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'right' }}>
                {task.progress}%
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Закрыть
        </Button>
        {task.status !== 'completed' && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              onComplete(task.id)
              onClose()
            }}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            Отметить как выполненную
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const TasksTab = () => {
  const { widgets, isEditMode, reorderWidgets, toggleWidgetWidth, toggleEditMode, resetToDefault } = useTasksState()
  const [activeId, setActiveId] = React.useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  // Тестовые данные задач
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Разработать новый интерфейс панели управления",
      description: "Создать макеты и реализовать новый UI для панели администратора",
      fullDescription: "Требуется полностью переработать пользовательский интерфейс панели управления. Включить новые графики, улучшить навигацию и добавить темную тему. Срок - 2 недели.",
      status: "in-progress",
      priority: "high",
      dueDate: "15.01.2024",
      progress: 65
    },
    {
      id: 2,
      title: "Исправить баги в модуле отчетности",
      description: "Устранить критические ошибки в генерации отчетов",
      fullDescription: "Обнаружены критические ошибки при генерации еженедельных отчетов. Необходимо провести тестирование и исправить все выявленные проблемы.",
      status: "pending",
      priority: "high",
      dueDate: "10.01.2024",
      progress: 0
    },
    {
      id: 3,
      title: "Обновить документацию API",
      description: "Дополнить документацию новыми endpoint-ами",
      fullDescription: "Добавить описание новых методов API, обновить примеры запросов и ответов. Проверить актуальность существующей документации.",
      status: "in-progress",
      priority: "medium",
      dueDate: "20.01.2024",
      progress: 30
    },
    {
      id: 4,
      title: "Провести код-ревью pull request-ов",
      description: "Проверить код коллег из отдела разработки",
      fullDescription: "Необходимо провести ревью 5 открытых pull request-ов от команды разработки. Особое внимание уделить качеству кода и тестам.",
      status: "pending",
      priority: "medium",
      dueDate: "12.01.2024",
      progress: 0
    },
    {
      id: 5,
      title: "Оптимизировать производительность базы данных",
      description: "Проанализировать и улучшить запросы к БД",
      fullDescription: "Провести анализ медленных запросов к базе данных, добавить индексы и оптимизировать существующие запросы для улучшения производительности.",
      status: "completed",
      priority: "low",
      dueDate: "05.01.2024",
      progress: 100
    }
  ])

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
      case 2: return 12 // полная ширина
      case 1: return 6  // половина ширины
      default: return 6
    }
  }

  // Функция для получения иконки по типу
  const getWidgetIcon = (iconType) => {
    switch (iconType) {
      case 'play': return <PlayArrowIcon />
      case 'task': return <TaskIcon />
      default: return <TaskIcon />
    }
  }

  // Обработчики задач
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setTaskDialogOpen(true)
  }

  const handleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', progress: 100 }
        : task
    ))
  }

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false)
    setSelectedTask(null)
  }

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'active-tasks':
        return (
          <ActiveTasksBlock 
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onComplete={handleTaskComplete}
          />
        )
      case 'tasks-stats':
        return <TasksStatsBlock tasks={tasks} />
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
            Управление задачами и отслеживание прогресса
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

      {/* Контент вкладки задач */}
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
              }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: 'primary.main' }}>
                Режим редактирования • Перетаскивайте блоки и меняйте ширину
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

      {/* Диалог просмотра задачи */}
      <TaskDialog
        task={selectedTask}
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        onComplete={handleTaskComplete}
      />
    </Box>
  )
}

export default TasksTab