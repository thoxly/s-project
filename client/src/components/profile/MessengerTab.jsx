import React from 'react'
import {
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Fab,
  TextField,
  IconButton,
  Button,
  useTheme // Добавляем импорт useTheme
} from '@mui/material'
import {
  Send as SendIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useMessengerState } from '../../hooks/useMessengerState'

const MessengerTab = () => {
  const theme = useTheme() // Получаем тему
  const {
    dialogs,
    activeDialog,
    newMessageText,
    setNewMessageText,
    openDialog,
    closeDialog,
    sendMessage,
    getTotalUnreadCount
  } = useMessengerState()

  const totalUnread = getTotalUnreadCount()
  const messagesEndRef = React.useRef(null)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Авто-прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [activeDialog?.messages])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Общение с коллегами и руководителями
            {totalUnread > 0 && (
              <Chip 
                label={totalUnread} 
                color="error" 
                size="small" 
                sx={{ ml: 2, fontWeight: 600 }}
              />
            )}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ minHeight: '600px', height: '70vh' }}>
        {/* Список диалогов */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
              '&:hover': {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
              }
            }}
          >
            <Box sx={{ 
              p: 2.5, 
              borderBottom: 1, 
              borderColor: 'divider',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Диалоги {totalUnread > 0 && `(${totalUnread})`}
              </Typography>
            </Box>
            
            <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {dialogs.map((dialog) => (
                <ListItem
                  key={dialog.id}
                  button
                  onClick={() => openDialog(dialog.id)}
                  selected={activeDialog?.id === dialog.id}
                  sx={{
                    borderRadius: 3,
                    mx: 0.5,
                    my: 0.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(255,255,255,0.8)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge 
                      badgeContent={dialog.unreadCount} 
                      color="error"
                      invisible={dialog.unreadCount === 0}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: activeDialog?.id === dialog.id ? 'white' : 'primary.main',
                          color: activeDialog?.id === dialog.id ? 'primary.main' : 'white',
                          fontWeight: 600
                        }}
                      >
                        {dialog.userAvatar}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.95rem'
                          }}
                        >
                          {dialog.userName}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: activeDialog?.id === dialog.id ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {dialog.lastMessageTime}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.85rem',
                          color: activeDialog?.id === dialog.id ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                        }}
                      >
                        {dialog.lastMessage || 'Нет сообщений'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Окно диалога */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
              '&:hover': {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
              }
            }}
          >
            {activeDialog ? (
              <>
                {/* Заголовок диалога */}
                <Box sx={{ 
                  p: 2.5, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        mr: 2,
                        width: 44,
                        height: 44,
                        fontWeight: 600
                      }}
                    >
                      {activeDialog.userAvatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {activeDialog.userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activeDialog.userPosition}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={closeDialog}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Сообщения */}
                <Box sx={{ 
                  flex: 1, 
                  p: 3, 
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, white 100%)'
                }}>
                  {activeDialog.messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isMy ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 1
                      }}
                    >
                      {!message.isMy && (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: 'primary.light',
                            fontSize: '0.8rem'
                          }}
                        >
                          {activeDialog.userAvatar}
                        </Avatar>
                      )}
                      <Box sx={{ maxWidth: '70%' }}>
                        <Paper
                          sx={{
                            p: 2.5,
                            backgroundColor: message.isMy ? 'primary.main' : 'background.paper',
                            color: message.isMy ? 'white' : 'text.primary',
                            // Красивые скругления с акцентом снизу
                            borderRadius: 4,
                            borderBottomRightRadius: message.isMy ? 8 : 4,
                            borderBottomLeftRadius: message.isMy ? 4 : 8,
                            boxShadow: message.isMy 
                              ? "0 2px 12px rgba(30, 58, 138, 0.25)" 
                              : "0 2px 8px rgba(0, 0, 0, 0.08)",
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            '&:hover': {
                              boxShadow: message.isMy 
                                ? "0 4px 16px rgba(30, 58, 138, 0.35)" 
                                : "0 4px 12px rgba(0, 0, 0, 0.12)",
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <Typography variant="body1" sx={{ lineHeight: 1.4, mb: 0.5 }}>
                            {message.text}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              textAlign: message.isMy ? 'right' : 'left',
                              opacity: 0.7,
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          >
                            {message.time}
                          </Typography>
                        </Paper>
                      </Box>
                      {message.isMy && (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          Я
                        </Avatar>
                      )}
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Поле ввода сообщения */}
                <Box sx={{ 
                  p: 2.5, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  background: 'white'
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder="Введите сообщение..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'background.default',
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={sendMessage}
                      disabled={!newMessageText.trim()}
                      sx={{ 
                        minWidth: 'auto', 
                        px: 3, 
                        borderRadius: 3,
                        height: '40px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        // Улучшенные цвета для лучшей читаемости
                        backgroundColor: '#1e40af',
                        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
                        '&:hover': {
                          backgroundColor: '#1d4ed8',
                          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                          boxShadow: '0 2px 4px rgba(30, 64, 175, 0.4)'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'grey.300',
                          background: 'none',
                          color: 'grey.500',
                          boxShadow: 'none',
                          transform: 'none'
                        }
                      }}
                    >
                      Отправить
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              /* Заглушка когда диалог не выбран */
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary',
                p: 3,
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)'
              }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Выберите диалог для общения
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Начните общение с коллегами или выберите существующий диалог из списка слева
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Кнопка нового сообщения */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.4)'
          }
        }}
        onClick={() => {/* Можно добавить функционал создания нового диалога */}}
      >
        <AddIcon />
      </Fab>
    </>
  )
}

export default MessengerTab