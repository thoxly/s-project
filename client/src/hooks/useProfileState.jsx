import { useState, useEffect } from 'react'
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  Info as InfoIcon
} from '@mui/icons-material'

export const useProfileState = () => {
  // Начальная конфигурация виджетов с React иконками
  const defaultWidgets = [
    {
      id: 'personal-info',
      title: 'Личная информация',
      icon: 'person',
      color: 'primary',
      width: 'full',
      visible: true,
      order: 0
    },
    {
      id: 'about-me',
      title: 'О себе',
      icon: 'info',
      color: 'success',
      width: 'third',
      visible: true,
      order: 1
    },
    {
      id: 'skills-info',
      title: 'Успехи и достижения',
      icon: 'school',
      color: 'warning',
      width: 'third',
      visible: true,
      order: 2
    },
    {
      id: 'colleague-thanks',
      title: 'Благодарности коллег',
      icon: 'favorite',
      color: 'error',
      width: 'third',
      visible: true,
      order: 3
    }
  ]

  // Функция для получения React иконки по имени
  const getIconComponent = (iconName) => {
    const iconMap = {
      'person': PersonIcon,
      'info': InfoIcon,
      'school': SchoolIcon,
      'favorite': FavoriteIcon
    }
    const IconComponent = iconMap[iconName] || PersonIcon
    return <IconComponent />
  }

  // Загружаем состояние из localStorage
  const [widgets, setWidgets] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultWidgets.map(widget => ({
        ...widget,
        iconElement: getIconComponent(widget.icon)
      }))
    }
    
    try {
      const savedWidgets = localStorage.getItem('profile-widgets')
      console.log('Loading from localStorage:', savedWidgets)
      
      if (savedWidgets) {
        const parsedWidgets = JSON.parse(savedWidgets)
        // Восстанавливаем React иконки
        const restoredWidgets = parsedWidgets.map(widget => ({
          ...widget,
          iconElement: getIconComponent(widget.icon)
        }))
        console.log('Restored widgets:', restoredWidgets)
        return restoredWidgets
      }
    } catch (error) {
      console.error('Error loading profile widgets from localStorage:', error)
    }
    
    // Возвращаем default с React иконками
    return defaultWidgets.map(widget => ({
      ...widget,
      iconElement: getIconComponent(widget.icon)
    }))
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Сохраняем в localStorage при изменении widgets
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      // Сохраняем только данные (без React элементов)
      const widgetsToSave = widgets.map(widget => ({
        id: widget.id,
        title: widget.title,
        icon: widget.icon, // Сохраняем строковое имя иконки
        color: widget.color,
        width: widget.width,
        visible: widget.visible,
        order: widget.order
      }))
      
      console.log('Saving to localStorage:', widgetsToSave)
      localStorage.setItem('profile-widgets', JSON.stringify(widgetsToSave))
    } catch (error) {
      console.error('Error saving profile widgets to localStorage:', error)
    }
  }, [widgets])

  // Перемещение виджетов
  const reorderWidgets = (oldIndex, newIndex) => {
    setWidgets(prevWidgets => {
      const newWidgets = [...prevWidgets]
      const [moved] = newWidgets.splice(oldIndex, 1)
      newWidgets.splice(newIndex, 0, moved)
      
      // Обновляем порядок
      const reorderedWidgets = newWidgets.map((widget, index) => ({
        ...widget,
        order: index
      }))
      
      console.log('Reordered widgets:', reorderedWidgets)
      return reorderedWidgets
    })
  }

  // Переключение ширины виджета
  const toggleWidgetWidth = (widgetId) => {
    setWidgets(prevWidgets => {
      const updatedWidgets = prevWidgets.map(widget => 
        widget.id === widgetId 
          ? { 
              ...widget, 
              width: widget.width === 'full' ? 'third' : 
                     widget.width === 'third' ? 'half' : 'full'
            }
          : widget
      )
      console.log('Width toggled:', updatedWidgets)
      return updatedWidgets
    })
  }

  // Переключение режима редактирования
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev)
  }

  // Сброс к настройкам по умолчанию
  const resetToDefault = () => {
    const resetWidgets = defaultWidgets.map((widget, index) => ({
      ...widget,
      iconElement: getIconComponent(widget.icon),
      order: index
    }))
    console.log('Reset to default:', resetWidgets)
    setWidgets(resetWidgets)
  }

  return {
    widgets: widgets.map(widget => ({
      ...widget,
      icon: widget.iconElement // Обеспечиваем обратную совместимость
    })),
    isLoading,
    isEditMode,
    reorderWidgets,
    toggleWidgetWidth,
    toggleEditMode,
    resetToDefault
  }
}