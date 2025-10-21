import { useState, useEffect } from 'react'
import {
  Announcement as NewsIcon,
  Event as EventIcon,
  Cake as BirthdayIcon,
  Link as LinkIcon
} from '@mui/icons-material'

const STORAGE_KEY = 'dashboard-state'

// Функция для получения иконки по имени
const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'NewsIcon':
      return <NewsIcon />
    case 'EventIcon':
      return <EventIcon />
    case 'BirthdayIcon':
      return <BirthdayIcon />
    case 'LinkIcon':
      return <LinkIcon />
    default:
      return <NewsIcon />
  }
}

const defaultWidgets = [
  {
    id: 'news',
    title: 'Новости',
    iconName: 'NewsIcon',
    color: 'primary',
    order: 0,
    width: 1 // 1 = стандартная ширина, 2 = двойная ширина
  },
  {
    id: 'events',
    title: 'Афиша',
    iconName: 'EventIcon',
    color: 'secondary',
    order: 1,
    width: 1
  },
  {
    id: 'birthdays',
    title: 'Дни рождения',
    iconName: 'BirthdayIcon',
    color: 'warning',
    order: 2,
    width: 1
  },
  {
    id: 'quicklinks',
    title: 'Быстрые ссылки',
    iconName: 'LinkIcon',
    color: 'info',
    order: 3,
    width: 1
  }
]

export const useDashboardState = () => {
  const [widgets, setWidgets] = useState(defaultWidgets)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  // Загружаем состояние из localStorage при монтировании
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        setWidgets(parsedState)
      }
    } catch (error) {
      console.error('Ошибка загрузки состояния дашборда:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets))
      } catch (error) {
        console.error('Ошибка сохранения состояния дашборда:', error)
      }
    }
  }, [widgets, isLoading])

  // Функция для изменения порядка виджетов
  const reorderWidgets = (startIndex, endIndex) => {
    setWidgets(prevWidgets => {
      const result = Array.from(prevWidgets)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      // Обновляем порядок
      return result.map((widget, index) => ({
        ...widget,
        order: index
      }))
    })
  }

  // Функция для изменения ширины виджета
  const toggleWidgetWidth = (widgetId) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, width: widget.width === 1 ? 2 : 1 }
          : widget
      )
    )
  }

  // Функция для сброса к настройкам по умолчанию
  const resetToDefault = () => {
    setWidgets(defaultWidgets)
  }

  // Функция для переключения режима редактирования
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev)
  }

  // Получаем отсортированные виджеты
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order)

  return {
    widgets: sortedWidgets,
    isLoading,
    isEditMode,
    reorderWidgets,
    toggleWidgetWidth,
    toggleEditMode,
    resetToDefault,
    getIconComponent
  }
}
