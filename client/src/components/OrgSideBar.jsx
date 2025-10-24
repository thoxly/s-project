// components/OrgSideBar.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import CloseIcon from '@mui/icons-material/Close';

export const OrgSideBar = ({
  avatarText = '?',
  avatarUrl = null,
  fullName = 'Имя Фамилия',
  position = 'Должность не указана',
  department = 'Подразделение не указано',
  phone = '—',
  workPhone = '—',
  email = '—',
  openState=null,
   onClose = () => {} 
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        maxWidth: 420,
        mx: 'auto',
        backgroundColor: 'background.paper',
        position: 'relative', // ← обязательно для абсолютного позиционирования
      }}
    >
      {/* Крестик в правом верхнем углу */}
        

      {/* Верхняя часть с аватаром и именем */}
      <Box
        sx={{
          backgroundColor: 'white',
          boxShadow: '0px 76px 61px -45px rgba(30, 60, 147, 0.36) inset',
          color: 'text.primary',
          padding: '24px 24px 8px 24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <IconButton
        onClick={onClose}
          sx={{
            position: 'absolute',
            top: 22,
            right: 20,
            width: 32,
            height: 32,
            mb:1,
            backgroundColor: 'rgba(30,60,147,0)',
            color: 'black',
            '&:hover': {
            backgroundColor: 'rgb(30,60,147)',
            color:'white'
          },
          }}
        >
          <CloseIcon sx={{ fontSize: '1rem', }} />
        </IconButton>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 1,
            bgcolor: avatarUrl ? 'transparent' : 'secondary.main',
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
            <Typography variant="h5">{avatarText}</Typography>
          ) : (
            <PersonOutlined sx={{ fontSize: '2.2rem', color: 'secondary.contrastText' }} />
          )}
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {fullName}
        </Typography>
      </Box>

      {/* Основная информация */}
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Должность
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {position}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Организация / подразделение
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {department}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary">
              Телефон
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {phone}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Служебный телефон
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {workPhone}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              E-mail
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {email}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            textTransform: 'none',
            mt: 3,
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Изменить данные
        </Button>
      </CardContent>
    </Card>
  );
};

