import React, { useState, useEffect } from 'react'
import {
  Snackbar,
  Alert,
  Fab,
  Tooltip,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  InstallMobile as InstallIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material'
import { 
  isMobile, 
  isStandalone, 
  addToHomeScreen, 
  showNotification,
  requestNotificationPermission 
} from '../utils/pwa'

const MobileEnhancements = () => {
  const theme = useTheme()
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'))
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState(false)
  const [showNotificationSnackbar, setShowNotificationSnackbar] = useState(false)

  // Проверяем, можно ли установить приложение
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      if (isMobile() && !isStandalone()) {
        setShowInstallBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Проверяем разрешения на уведомления
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission === 'granted')
    }
  }, [])

  // Обработка установки приложения
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallBanner(false)
        setInstallPrompt(null)
      }
    }
  }

  // Обработка запроса разрешений на уведомления
  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationPermission(granted)
    
    if (granted) {
      showNotification('Уведомления включены!', {
        body: 'Теперь вы будете получать важные обновления от Portal S',
        tag: 'notification-permission'
      })
    }
  }

  // Показываем уведомление о добавлении на главный экран
  const showAddToHomeScreenTip = () => {
    if (isMobile() && !isStandalone()) {
      setShowNotificationSnackbar(true)
    }
  }

  return (
    <>
      {/* Floating Action Button для установки */}
      {isMobileDevice && !isStandalone() && showInstallBanner && (
        <Fab
          color="primary"
          aria-label="install app"
          onClick={handleInstall}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 24 },
            left: { xs: 16, sm: 24 },
            zIndex: 1000,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <InstallIcon />
        </Fab>
      )}

      {/* Floating Action Button для уведомлений */}
      {isMobileDevice && !notificationPermission && (
        <Fab
          color="secondary"
          aria-label="enable notifications"
          onClick={handleRequestNotifications}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <NotificationsIcon />
        </Fab>
      )}

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={showNotificationSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowNotificationSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowNotificationSnackbar(false)}
          severity="info"
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setShowNotificationSnackbar(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GetAppIcon fontSize="small" />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Добавьте Portal S на главный экран
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Для лучшего опыта использования
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Snackbar>

      {/* Индикатор PWA режима */}
      {isStandalone() && (
        <Box
          sx={{
            position: 'fixed',
            top: 8,
            right: 8,
            zIndex: 1000,
            display: { xs: 'block', sm: 'none' }
          }}
        >
          <Tooltip title="Приложение запущено в PWA режиме">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'success.main',
                boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.6,
                    transform: 'scale(1.2)',
                  },
                },
              }}
            />
          </Tooltip>
        </Box>
      )}
    </>
  )
}

export default MobileEnhancements
