import React, { useState, useEffect, useRef } from 'react';
import useTouchGestures from '../hooks/useTouchGestures';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Badge,
  Fade,
  ClickAwayListener,
  Chip,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  Message as MessageIcon,
  Cake as CakeIcon,
  Notifications as NotificationsIcon,
  MarkAsUnread as MarkAsUnreadIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const NotificationsDropdown = ({ open, onClose, onUnreadCountChange, isMobile = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Сенсорные жесты для мобильных устройств
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    handleSwipe,
    touchHandlers
  } = useTouchGestures();

  // Обработка свайпов для закрытия уведомлений
  const handleSwipeGesture = (direction) => {
    if (isMobile && direction === 'left') {
      onClose();
    }
  };

  useEffect(() => {
    // Загружаем уведомления из mock файла
    fetch('/mock/notifications.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNotifications(data);
        setLoading(false);
        // Обновляем счетчик непрочитанных уведомлений
        const unreadCount = data.filter(n => !n.isRead).length;
        if (onUnreadCountChange) {
          onUnreadCountChange(unreadCount);
        }
      })
      .catch(error => {
        console.error('Ошибка загрузки уведомлений:', error);
        // Fallback данные
        setNotifications([
          {
            id: 1,
            title: "Новая заявка одобрена",
            message: "Ваша заявка на отпуск с 15 по 25 января была одобрена руководителем",
            type: "success",
            date: "2025-01-20T10:30:00Z",
            isRead: false,
            icon: "check_circle"
          },
          {
            id: 2,
            title: "Напоминание о встрече",
            message: "У вас запланирована встреча с командой разработки в 14:00",
            type: "info",
            date: "2025-01-20T09:15:00Z",
            isRead: false,
            icon: "event"
          },
          {
            id: 3,
            title: "Обновление системы",
            message: "Запланировано техническое обслуживание системы с 22:00 до 02:00",
            type: "warning",
            date: "2025-01-19T16:45:00Z",
            isRead: true,
            icon: "warning"
          }
        ]);
        setLoading(false);
        // Обновляем счетчик для fallback данных
        if (onUnreadCountChange) {
          onUnreadCountChange(2); // 2 непрочитанных в fallback данных
        }
      });
  }, []);

  const getIcon = (iconName) => {
    const iconMap = {
      check_circle: <CheckCircleIcon />,
      event: <EventIcon />,
      warning: <WarningIcon />,
      message: <MessageIcon />,
      cake: <CakeIcon />
    };
    return iconMap[iconName] || <NotificationsIcon />;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      message: 'primary',
      celebration: 'secondary'
    };
    return colorMap[type] || 'default';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'только что';
    } else if (diffInHours < 24) {
      return `${diffInHours} ч. назад`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} дн. назад`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      );
      // Обновляем счетчик непрочитанных
      const unreadCount = updated.filter(n => !n.isRead).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
      // Вибрация для мобильных устройств
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, isRead: true }));
      // Обновляем счетчик непрочитанных
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
      return updated;
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!open) return null;

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: isMobile ? 'calc(100vw - 32px)' : 380,
            maxWidth: isMobile ? 'calc(100vw - 32px)' : 380,
            maxHeight: isMobile ? 'calc(100vh - 120px)' : 500,
            overflow: 'hidden',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            zIndex: 1300,
            mt: 1,
            mx: isMobile ? 2 : 0
          }}
          {...(isMobile ? touchHandlers : {})}
          onTouchEnd={(e) => {
            onTouchEnd(e);
            handleSwipe(handleSwipeGesture);
          }}
        >
          {/* Заголовок */}
          <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                Уведомления
                {unreadCount > 0 && (
                  <Chip 
                    label={unreadCount} 
                    size="small" 
                    color="error" 
                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkAsUnreadIcon />}
                  onClick={markAllAsRead}
                  sx={{ 
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    minWidth: { xs: 'auto', md: 'auto' }
                  }}
                >
                  {isMobile ? 'Все' : 'Прочитать все'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Список уведомлений */}
          <Box sx={{ 
            maxHeight: isMobile ? 'calc(100vh - 200px)' : 400, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0,0,0,0.3)',
            }
          }}>
            {loading ? (
              <Box sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
                <Typography color="text.secondary">Загрузка...</Typography>
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
                <NotificationsIcon sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  color: 'text.disabled', 
                  mb: 1 
                }} />
                <Typography color="text.secondary">Нет уведомлений</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        py: { xs: 1, md: 1.5 },
                        px: { xs: 1.5, md: 2 },
                        cursor: 'pointer',
                        backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        },
                        '&:active': {
                          backgroundColor: 'action.selected',
                          transform: 'scale(0.98)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <ListItemIcon sx={{ minWidth: { xs: 36, md: 40 } }}>
                        <Avatar
                          sx={{
                            width: { xs: 28, md: 32 },
                            height: { xs: 28, md: 32 },
                            backgroundColor: `${getTypeColor(notification.type)}.light`,
                            color: `${getTypeColor(notification.type)}.main`
                          }}
                        >
                          {getIcon(notification.icon)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant={isMobile ? "body2" : "subtitle2"}
                              sx={{
                                fontWeight: notification.isRead ? 500 : 600,
                                color: notification.isRead ? 'text.primary' : 'primary.main',
                                fontSize: { xs: '0.875rem', md: '0.875rem' }
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.isRead && (
                              <Box
                                sx={{
                                  width: { xs: 6, md: 8 },
                                  height: { xs: 6, md: 8 },
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ 
                                mb: 0.5,
                                fontSize: { xs: '0.8rem', md: '0.875rem' },
                                lineHeight: { xs: 1.3, md: 1.4 }
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.disabled"
                              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                            >
                              {formatTime(notification.date)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Футер */}
          {notifications.length > 0 && (
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              borderTop: '1px solid', 
              borderColor: 'divider' 
            }}>
              <Button
                fullWidth
                variant="outlined"
                size={isMobile ? "medium" : "small"}
                startIcon={<ClearIcon />}
                onClick={onClose}
                sx={{
                  fontSize: { xs: '0.875rem', md: '0.875rem' },
                  py: { xs: 1, md: 0.5 }
                }}
              >
                Закрыть
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </ClickAwayListener>
  );
};

export default NotificationsDropdown;
