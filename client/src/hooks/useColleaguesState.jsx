// hooks/useColleaguesState.js
import { useState, useEffect } from 'react'

const COLLEAGUES_BLOCKS_STORAGE_KEY = 'colleagues-tab-blocks-config'

// Начальная конфигурация блоков
const defaultBlocks = [
  { 
    id: 'supervisor', 
    title: 'Непосредственный руководитель',
    type: 'supervisor',
    gridSize: { xs: 12, md: 8 },
    width: 'half',
    order: 0,
    icon: 'supervisor',
    color: 'info'
  },
  { 
    id: 'all-colleagues', 
    title: 'Все коллеги',
    type: 'all-colleagues',
    gridSize: { xs: 12, md: 4 },
    width: 'third',
    order: 1,
    icon: 'group',
    color: 'success'
  }
]

// Функции для работы с localStorage
const saveBlocksToStorage = (blocks) => {
  try {
    localStorage.setItem(COLLEAGUES_BLOCKS_STORAGE_KEY, JSON.stringify(blocks))
  } catch (error) {
    console.error('Ошибка сохранения конфигурации блоков:', error)
  }
}

const loadBlocksFromStorage = () => {
  try {
    const saved = localStorage.getItem(COLLEAGUES_BLOCKS_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Ошибка загрузки конфигурации блоков:', error)
  }
  return null
}

export const useColleaguesState = () => {
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
        // Циклическое переключение между third -> half -> full -> third
        const widthCycle = {
          'third': 'half',
          'half': 'full',
          'full': 'third'
        }
        
        const newWidth = widthCycle[widget.width] || 'half'
        const newGridSize = {
          'third': { xs: 12, md: 4 },
          'half': { xs: 12, md: 8 },
          'full': { xs: 12, md: 12 }
        }[newWidth]
        
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
    localStorage.removeItem(COLLEAGUES_BLOCKS_STORAGE_KEY)
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