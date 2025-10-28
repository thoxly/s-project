// components/EmployeeModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BusinessIcon from '@mui/icons-material/Business';

export const EmployeeModal = ({
  open = false,
  onClose = () => {},
  avatarText = '?',
  avatarUrl = null,
  fullName = 'Имя Фамилия',
  position = 'Должность не указана',
  department = 'Подразделение не указано',
  phone = '—',
  workPhone = '—',
  email = '—',
}) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: `${label} скопирован в буфер обмена` });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.95) 0%, rgba(30, 60, 147, 0.85) 100%)',
            color: 'white',
            p: 3,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ textAlign: 'center', pr: 6 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: avatarUrl ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              ) : avatarText ? (
                <Typography variant="h5" sx={{ color: 'white' }}>
                  {avatarText}
                </Typography>
              ) : (
                <PersonOutlined sx={{ fontSize: '3rem', color: 'white' }} />
              )}
            </Avatar>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {fullName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {position}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Быстрые действия */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 2,
              backgroundColor: 'rgba(30, 60, 147, 0.04)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {phone && phone !== '—' && (
              <Tooltip title="Позвонить" arrow>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => (window.location.href = `tel:${phone}`)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(30, 60, 147, 0.25)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(30, 60, 147, 0.35)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Звонок
                </Button>
              </Tooltip>
            )}
            {email && email !== '—' && (
              <Tooltip title="Написать письмо" arrow>
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={() => (window.location.href = `mailto:${email}`)}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(30, 60, 147, 0.25)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(30, 60, 147, 0.35)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Email
                </Button>
              </Tooltip>
            )}
          </Box>

          {/* Основная информация */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Организация / подразделение
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500} sx={{ pl: 3.5 }}>
                  {department}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Телефон
                    </Typography>
                  </Box>
                  {phone && phone !== '—' && (
                    <Tooltip title="Копировать">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(phone, 'Телефон')}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'rgba(30, 60, 147, 0.08)' },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body1" fontWeight={500} sx={{ pl: 3.5 }}>
                  {phone}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Служебный телефон
                    </Typography>
                  </Box>
                  {workPhone && workPhone !== '—' && (
                    <Tooltip title="Копировать">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(workPhone, 'Служебный телефон')}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'rgba(30, 60, 147, 0.08)' },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body1" fontWeight={500} sx={{ pl: 3.5 }}>
                  {workPhone}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      E-mail
                    </Typography>
                  </Box>
                  {email && email !== '—' && (
                    <Tooltip title="Копировать">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(email, 'Email')}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'rgba(30, 60, 147, 0.08)' },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    pl: 3.5,
                    wordBreak: 'break-word',
                  }}
                >
                  {email}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Уведомление о копировании */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
