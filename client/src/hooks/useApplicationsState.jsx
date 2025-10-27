// hooks/useApplicationstab.js
import { useState, useEffect } from 'react'
import { Add as AddIcon, PendingActions as StatusIcon } from '@mui/icons-material'

export const useApplicationsState = () => {
  const [widgets, setWidgets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  // Стартовые виджеты - только два блока
  const defaultWidgets = [
    {
      id: 'create-application',
      title: 'Создание заявки',
      icon: 'AddIcon', // Сохраняем как строку
      color: 'primary',
      width: 'half'
    },
    {
      id: 'application-status',
      title: 'Статус заявок',
      icon: 'StatusIcon', // Сохраняем как строку
      color: 'secondary',
      width: 'half'
    }
  ]

  // Функция для восстановления иконок из строк
  const restoreIcons = (widgetsData) => {
    return widgetsData.map(widget => {
      let iconComponent;
      switch (widget.icon) {
        case 'AddIcon':
          iconComponent = <AddIcon />;
          break;
        case 'StatusIcon':
          iconComponent = <StatusIcon />;
          break;
        default:
          iconComponent = <AddIcon />;
      }
      return { ...widget, icon: iconComponent };
    });
  }

  useEffect(() => {
    // Загрузка данных из localStorage
    const loadWidgets = () => {
      setIsLoading(true)
      try {
        const savedWidgets = localStorage.getItem('applications-widgets')
        if (savedWidgets) {
          const parsedWidgets = JSON.parse(savedWidgets)
          // Восстанавливаем иконки из строк
          const widgetsWithIcons = restoreIcons(parsedWidgets)
          setWidgets(widgetsWithIcons)
        } else {
          setWidgets(restoreIcons(defaultWidgets))
        }
      } catch (error) {
        console.error('Error loading widgets:', error)
        setWidgets(restoreIcons(defaultWidgets))
      }
      setIsLoading(false)
    }

    loadWidgets()
  }, [])

  // Функция для подготовки виджетов к сохранению (конвертируем иконки в строки)
  const prepareWidgetsForSave = (widgetsData) => {
    return widgetsData.map(widget => {
      let iconString = 'AddIcon'; // по умолчанию
      
      if (widget.icon && widget.icon.type) {
        if (widget.icon.type.name === 'AddIcon') {
          iconString = 'AddIcon';
        } else if (widget.icon.type.name === 'StatusIcon') {
          iconString = 'StatusIcon';
        }
      } else if (typeof widget.icon === 'string') {
        iconString = widget.icon;
      }
      
      return {
        ...widget,
        icon: iconString
      };
    });
  }

  const saveWidgets = (newWidgets) => {
    try {
      // Подготавливаем виджеты для сохранения (конвертируем иконки в строки)
      const widgetsToSave = prepareWidgetsForSave(newWidgets)
      // Сохраняем в localStorage
      localStorage.setItem('applications-widgets', JSON.stringify(widgetsToSave))
      // Обновляем состояние с правильными иконками
      setWidgets(newWidgets)
    } catch (error) {
      console.error('Error saving widgets:', error)
    }
  }

  const reorderWidgets = (oldIndex, newIndex) => {
    const newWidgets = [...widgets]
    const [movedWidget] = newWidgets.splice(oldIndex, 1)
    newWidgets.splice(newIndex, 0, movedWidget)
    saveWidgets(newWidgets)
  }

  const toggleWidgetWidth = (widgetId) => {
    const newWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        const newWidth = widget.width === 'half' ? 'full' : 'half'
        console.log(`Changing width for ${widgetId} from ${widget.width} to ${newWidth}`)
        return { 
          ...widget, 
          width: newWidth 
        }
      }
      return widget
    })
    saveWidgets(newWidgets)
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const resetToDefault = () => {
    const defaultWithIcons = restoreIcons(defaultWidgets)
    setWidgets(defaultWithIcons)
    localStorage.removeItem('applications-widgets')
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