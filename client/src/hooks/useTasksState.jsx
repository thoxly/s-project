// hooks/useTasksState.js
import { useState, useEffect } from 'react'

const TASKS_BLOCKS_STORAGE_KEY = 'tasks-tab-blocks-config'

// Начальная конфигурация блоков
const defaultBlocks = [
  { 
    id: 'active-tasks', 
    title: 'Активные задачи',
    type: 'active-tasks',
    gridSize: { xs: 12, md: 8 },
    width: 1,
    order: 0,
    icon: 'play',
    color: 'primary'
  },
  { 
    id: 'tasks-stats', 
    title: 'Статистика',
    type: 'tasks-stats',
    gridSize: { xs: 12, md: 4 },
    width: 1,
    order: 1,
    icon: 'task',
    color: 'info'
  }
]

// Функции для работы с localStorage
const saveBlocksToStorage = (blocks) => {
  try {
    localStorage.setItem(TASKS_BLOCKS_STORAGE_KEY, JSON.stringify(blocks))
  } catch (error) {
    console.error('Ошибка сохранения конфигурации блоков:', error)
  }
}

const loadBlocksFromStorage = () => {
  try {
    const saved = localStorage.getItem(TASKS_BLOCKS_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Ошибка загрузки конфигурации блоков:', error)
  }
  return null
}

export const useTasksState = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedBlocks = loadBlocksFromStorage()
    return savedBlocks || defaultBlocks
  })
  
  const [isEditMode, setIsEditMode] = useState(false)

  // Сохранение в localStorage при изменении widgets
  useEffect(() => {
    saveBlocksToStorage(widgets)
  }, [widgets])

  const reorderWidgets = (oldIndex, newIndex) => {
    setWidgets(prev => {
      const newWidgets = [...prev]
      const [movedWidget] = newWidgets.splice(oldIndex, 1)
      newWidgets.splice(newIndex, 0, movedWidget)
      
      return newWidgets.map((widget, index) => ({
        ...widget,
        order: index
      }))
    })
  }

  const toggleWidgetWidth = (widgetId) => {
    setWidgets(prev => prev.map(widget => {
      if (widget.id === widgetId) {
        const newWidth = widget.width === 1 ? 2 : 1
        const newGridSize = newWidth === 2 ? { xs: 12, md: 12 } : { xs: 12, md: widget.type === 'active-tasks' ? 8 : 4 }
        
        return {
          ...widget,
          width: newWidth,
          gridSize: newGridSize
        }
      }
      return widget
    }))
  }

  const toggleEditMode = () => {
    setIsEditMode(prev => !prev)
  }

  const resetToDefault = () => {
    setWidgets(defaultBlocks)
    localStorage.removeItem(TASKS_BLOCKS_STORAGE_KEY)
  }

  return {
    widgets,
    isEditMode,
    reorderWidgets,
    toggleWidgetWidth,
    toggleEditMode,
    resetToDefault
  }
}