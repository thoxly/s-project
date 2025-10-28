import { useState, useEffect } from 'react'

// Вспомогательная функция для определения нового gridSize
const getNewGridSize = (blockType, newWidth) => {
  if (newWidth === 2) {
    return { xs: 12, md: 12 }
  }
  
  // Возвращаем стандартные размеры для разных типов блоков
  switch (blockType) {
    case 'calendar':
      return { xs: 12, md: 8 }
    case 'upcoming':
      return { xs: 12, md: 4 }
    case 'supervisor':
      return { xs: 12, md: 6 }
    case 'all-colleagues':
      return { xs: 12, md: 6 }
    case 'active-tasks':
      return { xs: 12, md: 8 }
    case 'tasks-stats':
      return { xs: 12, md: 4 }
    default:
      return { xs: 12, md: 6 }
  }
}

export const useBlocksState = (tabId, defaultBlocks) => {
  const [blocks, setBlocks] = useState(() => {
    // При инициализации проверяем localStorage
    try {
      const savedBlocks = localStorage.getItem(`blocks-${tabId}`)
      if (savedBlocks) {
        const parsedBlocks = JSON.parse(savedBlocks)
        // Убедимся, что у всех блоков есть gridSize
        return parsedBlocks.map(block => ({
          ...block,
          gridSize: block.gridSize || getNewGridSize(block.type, block.width)
        }))
      }
      // Для defaultBlocks тоже добавляем gridSize
      return defaultBlocks.map(block => ({
        ...block,
        gridSize: block.gridSize || getNewGridSize(block.type, block.width)
      }))
    } catch (error) {
      console.error('Error loading blocks state:', error)
      return defaultBlocks.map(block => ({
        ...block,
        gridSize: block.gridSize || getNewGridSize(block.type, block.width)
      }))
    }
  })

  // Сохраняем в localStorage при изменении blocks
  useEffect(() => {
    localStorage.setItem(`blocks-${tabId}`, JSON.stringify(blocks))
  }, [blocks, tabId])

  // Переключение ширины блока
  const toggleBlockWidth = (blockId) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        const newWidth = block.width === 1 ? 2 : 1
        const newGridSize = getNewGridSize(block.type, newWidth)
        
        return {
          ...block,
          width: newWidth,
          gridSize: newGridSize
        }
      }
      return block
    }))
  }

  // Перемещение блоков
  const reorderBlocks = (oldIndex, newIndex) => {
    setBlocks(prev => {
      const newBlocks = [...prev]
      const [movedBlock] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, movedBlock)
      
      return newBlocks.map((block, index) => ({
        ...block,
        order: index
      }))
    })
  }

  // Сброс к настройкам по умолчанию
  const resetToDefault = () => {
    setBlocks(defaultBlocks.map((block, index) => ({
      ...block,
      order: index,
      gridSize: getNewGridSize(block.type, block.width)
    })))
  }

  return {
    blocks,
    toggleBlockWidth,
    reorderBlocks,
    resetToDefault,
    setBlocks
  }
}