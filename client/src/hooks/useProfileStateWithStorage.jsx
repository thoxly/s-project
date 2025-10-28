import { useState, useEffect } from 'react'

export const useProfileStateWithStorage = () => {
  // Начальная конфигурация виджетов
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

  // Загружаем состояние из localStorage
  const [widgets, setWidgets] = useState(() => {
    if (typeof window === 'undefined') return defaultWidgets
    
    try {
      const saved = localStorage.getItem('profile-widgets')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading widgets:', error)
    }
    return defaultWidgets
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('profile-widgets', JSON.stringify(widgets))
    } catch (error) {
      console.error('Error saving widgets:', error)
    }
  }, [widgets])

  // Перемещение виджетов
  const reorderWidgets = (oldIndex, newIndex) => {
    setWidgets(prev => {
      const newWidgets = [...prev]
      const [moved] = newWidgets.splice(oldIndex, 1)
      newWidgets.splice(newIndex, 0, moved)
      
      return newWidgets.map((widget, index) => ({
        ...widget,
        order: index
      }))
    })
  }

  // Переключение ширины виджета
  const toggleWidgetWidth = (widgetId) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { 
            ...widget, 
            width: widget.width === 'full' ? 'third' : 
                   widget.width === 'third' ? 'half' : 'full'
          }
        : widget
    ))
  }

  // Переключение режима редактирования
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev)
  }

  // Сброс к настройкам по умолчанию
  const resetToDefault = () => {
    setWidgets(defaultWidgets.map((widget, index) => ({
      ...widget,
      order: index
    })))
  }

  return {
    widgets,
    isLoading,
    isEditMode,
    reorderWidgets,
    toggleWidgetWidth,
    toggleEditMode,
    resetToDefault
  }
}