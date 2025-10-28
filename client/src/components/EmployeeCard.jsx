// components/EmployeeCard.jsx
import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { ApartmentOutlined, InfoOutlined, PhoneOutlined, EmailOutlined } from '@mui/icons-material';
export const EmployeeCard = ({
  data = null,
  department = false,
  avatarUrl = null,
  avatarText = '?',
  fullName = 'Имя Фамилия',
  position = 'Должность не указана',
  phone = '-',
  work_phone = '-',
  email = '-',
  onDepartmentClick = null, // новый пропс для обработки клика по отделу
  onEmployeeClick = null, // новый пропс для обработки клика по сотруднику
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenModal = () => {
    // Открываем модальное окно с данными сотрудника
    if (onEmployeeClick) {
      onEmployeeClick({
        avatarUrl,
        fullName,
        position,
        department: 'Сотрудник',
        phone: phone,
        workPhone: work_phone,
        email: email,
      });
    }
  };

  const handleClick = () => {
    if (department && onDepartmentClick) {
      onDepartmentClick(data);
    } else if (!department) {
      handleOpenModal();
    }
  };

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: 2.5,
        boxShadow: isHovered && !department ? '0 8px 24px rgba(30, 60, 147, 0.15)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        minHeight: 72,
        px: 2,
        py: 1.5,
        maxWidth: '100%',
        cursor: department ? 'default' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered && !department ? 'translateY(-2px) scale(1.01)' : 'none',
        borderColor: isHovered && !department ? 'primary.main' : 'divider',
        borderWidth: isHovered && !department ? 2 : 1,
        backgroundColor: isHovered && !department ? 'rgba(30, 60, 147, 0.02)' : 'background.paper',
      }}
      onClick={handleClick}
    >
      <Avatar
        sx={{
          width: 52,
          height: 52,
          margin: '0 16px 0 0',
          bgcolor: avatarUrl ? 'transparent' : department ? 'rgba(30, 60, 147, 0.8)' : 'primary.main',
          border: isHovered && !department ? '3px solid' : '2px solid',
          borderColor: isHovered && !department ? 'primary.main' : 'transparent',
          transition: 'all 0.3s ease',
          transform: isHovered && !department ? 'scale(1.1)' : 'scale(1)',
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
          <ApartmentOutlined sx={{ fontSize: '1.8rem', color: 'white' }} />
        ) : (
          <PersonOutlined sx={{ fontSize: '1.8rem', color: 'white' }} />
        )}
      </Avatar>

      <Box sx={{ overflow: 'hidden', pr: department ? 0 : 12, flex: 1 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            lineHeight: 1.3,
            mb: 0.5,
            color: department ? 'primary.main' : 'text.primary',
            fontSize: department ? '1rem' : '0.95rem',
          }}
        >
          {fullName}
        </Typography>
        {position && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.3, fontSize: '0.875rem' }}
          >
            {position}
          </Typography>
        )}
      </Box>

      {!department && (
        <Fade in={isHovered} timeout={200}>
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: 0.5,
            }}
          >
            {phone && phone !== '-' && (
              <Tooltip title="Позвонить" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${phone}`;
                  }}
                  sx={{
                    color: 'primary.main',
                    backgroundColor: 'rgba(30, 60, 147, 0.08)',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <PhoneOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {email && email !== '-' && (
              <Tooltip title="Написать письмо" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${email}`;
                  }}
                  sx={{
                    color: 'primary.main',
                    backgroundColor: 'rgba(30, 60, 147, 0.08)',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <EmailOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Подробнее" arrow placement="top">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                }}
                sx={{
                  color: 'primary.main',
                  backgroundColor: 'rgba(30, 60, 147, 0.08)',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
      )}
    </Card>
  );
};
