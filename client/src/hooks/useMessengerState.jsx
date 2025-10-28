import { useState, useEffect } from 'react'

export const useMessengerState = () => {
  // Начальные данные диалогов
  const initialDialogs = [
    {
      id: '1',
      userId: '2',
      userName: 'Петров П.П.',
      userPosition: 'Руководитель отдела разработки',
      userAvatar: 'ПП',
      lastMessage: 'Жду отчет по проекту к 18:00',
      lastMessageTime: '14:30',
      unreadCount: 2,
      messages: [
        {
          id: '1-1',
          text: 'Добрый день! Как продвигается работа над проектом?',
          time: '10:15',
          isMy: false
        },
        {
          id: '1-2',
          text: 'Добрый день! Почти закончил, осталось протестировать',
          time: '10:20',
          isMy: true
        },
        {
          id: '1-3',
          text: 'Отлично! Жду отчет по проекту к 18:00',
          time: '14:30',
          isMy: false
        }
      ]
    },
    {
      id: '2',
      userId: '3',
      userName: 'Иванова А.С.',
      userPosition: 'Старший разработчик',
      userAvatar: 'АИ',
      lastMessage: 'Привет! Посмотри новый PR когда будет время',
      lastMessageTime: '12:45',
      unreadCount: 1,
      messages: [
        {
          id: '2-1',
          text: 'Привет! Посмотри новый PR когда будет время',
          time: '12:45',
          isMy: false
        }
      ]
    },
    {
      id: '3',
      userId: '4',
      userName: 'Сидоров М.В.',
      userPosition: 'Frontend разработчик',
      userAvatar: 'МС',
      lastMessage: 'Спасибо за помощь с багом!',
      lastMessageTime: 'Вчера',
      unreadCount: 0,
      messages: [
        {
          id: '3-1',
          text: 'Спасибо за помощь с багом!',
          time: 'Вчера',
          isMy: false
        },
        {
          id: '3-2',
          text: 'Всегда рад помочь!',
          time: 'Вчера',
          isMy: true
        }
      ]
    }
  ]

  const [dialogs, setDialogs] = useState(() => {
    try {
      const saved = localStorage.getItem('messenger-dialogs')
      return saved ? JSON.parse(saved) : initialDialogs
    } catch {
      return initialDialogs
    }
  })

  const [activeDialog, setActiveDialog] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')

  // Сохраняем диалоги в localStorage
  useEffect(() => {
    localStorage.setItem('messenger-dialogs', JSON.stringify(dialogs))
  }, [dialogs])

  // Обновляем активный диалог при изменении dialogs
  useEffect(() => {
    if (activeDialog) {
      const updatedDialog = dialogs.find(d => d.id === activeDialog.id)
      if (updatedDialog) {
        setActiveDialog(updatedDialog)
      }
    }
  }, [dialogs, activeDialog?.id])

  // Открытие диалога
  const openDialog = (dialogId) => {
    const dialog = dialogs.find(d => d.id === dialogId)
    if (dialog) {
      setActiveDialog(dialog)
      // Сбрасываем счетчик непрочитанных при открытии
      if (dialog.unreadCount > 0) {
        markAsRead(dialogId)
      }
    }
  }

  // Закрытие диалога
  const closeDialog = () => {
    setActiveDialog(null)
    setNewMessageText('')
  }

  // Отправка сообщения
  const sendMessage = () => {
    if (!newMessageText.trim() || !activeDialog) return

    const newMessage = {
      id: `${activeDialog.id}-${Date.now()}`,
      text: newMessageText.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isMy: true
    }

    const updatedDialogs = dialogs.map(dialog => {
      if (dialog.id === activeDialog.id) {
        return {
          ...dialog,
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.time,
          messages: [...dialog.messages, newMessage]
        }
      }
      return dialog
    })

    setDialogs(updatedDialogs)
    setNewMessageText('')
  }

  // Пометить как прочитанное
  const markAsRead = (dialogId) => {
    setDialogs(prev => prev.map(dialog => 
      dialog.id === dialogId ? { ...dialog, unreadCount: 0 } : dialog
    ))
  }

  // Получить общее количество непрочитанных сообщений
  const getTotalUnreadCount = () => {
    return dialogs.reduce((total, dialog) => total + dialog.unreadCount, 0)
  }

  // Создать новый диалог
  const createNewDialog = (user) => {
    const newDialog = {
      id: `new-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userPosition: user.position,
      userAvatar: user.avatar,
      lastMessage: '',
      lastMessageTime: 'Только что',
      unreadCount: 0,
      messages: []
    }

    setDialogs(prev => [newDialog, ...prev])
    setActiveDialog(newDialog)
  }

  return {
    dialogs,
    activeDialog,
    newMessageText,
    setNewMessageText,
    openDialog,
    closeDialog,
    sendMessage,
    getTotalUnreadCount,
    createNewDialog
  }
}