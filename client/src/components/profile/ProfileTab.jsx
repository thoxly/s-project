import React from 'react'
import {
  Grid,
  Typography,
  Box,
  Fab,
  Tooltip,
  Zoom,
  CircularProgress
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
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

// Импорт компонентов виджетов
import PersonalInfoBlock from "./widgets/profile/PersonalInfoBlock";
import SkillsInfoBlock from "./widgets/profile/SkillsInfoBlock";
import ColleagueThanksBlock from "./widgets/profile/ColleagueThanksBlock";
import DraggableCard from '../DraggableCard'
import { useProfileState } from '../../hooks/useProfileState';
import AboutMeBlock from "./widgets/profile/AboutMeBlock";

const ProfileTab = () => {
  const { widgets, isLoading, isEditMode, reorderWidgets, toggleWidgetWidth, toggleEditMode, resetToDefault } = useProfileState()
  const [activeId, setActiveId] = React.useState(null)

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
      default: return 12
    }
  }

  // Функция для преобразования ширины в числовое значение для DraggableCard
  const getCardWidth = (width) => {
    switch (width) {
      case 'full': return 2
      case 'half': return 2  
      case 'third': return 1
      default: return 1
    }
  }

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'personal-info':
        return <PersonalInfoBlock />
      case 'about-me':
        return <AboutMeBlock />
      case 'skills-info':
        return <SkillsInfoBlock />
      case 'colleague-thanks':
        return <ColleagueThanksBlock />
      default:
        return null
    }
  }

  // Добавим отладочный вывод
  React.useEffect(() => {
    console.log('Current widgets in ProfileTab:', widgets)
  }, [widgets])

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Загрузка профиля...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Профиль
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Личная информация и настройки профиля
          </Typography>
        </Box>
        
        <Tooltip title={isEditMode ? "Выйти из режима редактирования" : "Настроить профиль"}>
          <Fab
            size="small"
            color={isEditMode ? "primary" : "default"}
            onClick={toggleEditMode}
          >
            <SettingsIcon />
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
                      icon={widget.icon}
                      color={widget.color}
                      onToggleWidth={toggleWidgetWidth}
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
                    icon={widget.icon}
                    color={widget.color}
                    onToggleWidth={toggleWidgetWidth}
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
    </>
  )
}

export default ProfileTab