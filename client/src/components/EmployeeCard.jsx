// components/EmployeeCard.jsx
import React from 'react';
import {
  Card,
  Avatar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { ApartmentOutlined, InfoOutlined } from '@mui/icons-material';
import { useGlobalState } from '../store/GlobalContext'; // импортируем хук

export const EmployeeCard = ({
  data = null,
  department = false,
  avatarUrl = null,
  avatarText = '?',
  fullName = 'Имя Фамилия',
  position = 'Должность не указана',
  phone='-',
  work_phone='-',
  email='-'

}) => {
  const { dispatch } = useGlobalState(); // получаем dispatch

  const handleOpenSidebar = () => {
    // Открываем боковую панель с данными из карточки
    dispatch({
      type: 'OPEN_SIDEBAR',
      payload: {
        avatarUrl,
        fullName,
        position,
        department: department ? 'Подразделение' : 'Сотрудник',
        phone: phone,
        workPhone: work_phone,
        email: email,
      },
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        minHeight: 64,
        px: 1.5,
        py: 1,
        maxWidth: '100%',
      }}
    >
      <Avatar
        sx={{
          width: 48,
          height: 48,
          mx: 'auto',
          margin: '0 20px 0 0',
          mb: 1,
          bgcolor: avatarUrl ? 'transparent' : 'rgb(30,60,147)',
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
        ) : department ? (
          <ApartmentOutlined sx={{ fontSize: '2.2rem', color: 'secondary.contrastText' }} />
        ) : (
          <PersonOutlined sx={{ fontSize: '2.2rem', color: 'secondary.contrastText' }} />
        )}
      </Avatar>

      <Box sx={{ overflow: 'hidden', pr: 4 }}>
        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
          {fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
          {position}
        </Typography>
      </Box>

      {department ? (
        ''
      ) : (
        <IconButton
          size="small"
          onClick={handleOpenSidebar} // ← вызываем при клике
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(30,60,147,0.1)',
            },
          }}
        >
          <InfoOutlined fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
};
