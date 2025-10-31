// src/components/SupportRequestCard.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// Карта цветов для статусов (можно вынести в utils/constants)
const statusColors = {
  'Новая': 'default',
  'В работе': 'info',
  'Принята':'secondary',
  'На согласовании': 'warning',
  'Закрыта': 'success',
  'Отменена': 'error',
  'Выполнена':'success'
  // Добавьте другие статусы по необходимости
};

const SupportRequestCard = ({ request, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    // Проверяем валидность даты
    if (isNaN(date.getTime())) return 'Неверная дата';
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Извлекаем данные с дефолтными значениями
  const {
    ticketNumber = '—',
    createdAt,
    type = '—',
    description = '',
    status = 'Неизвестно',
    assignee = '—',
  } = request || {};

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 1.5, sm: 2 },
        border: '1px solid',
        borderColor: 'grey.300',
        backgroundColor: 'rgba(245, 245, 245, 0.6)',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              backgroundColor: 'rgba(245, 245, 245, 0.8)',
              transform: isMobile ? 'none' : 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }
          : {},
        borderRadius: { xs: 1.5, sm: 2 },
      }}
    >
      {/* Заголовок карточки: Номер заявки и Статус */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          {ticketNumber}
        </Typography>
        <Chip
          label={status}
          size="small"
          color={statusColors[status] || 'default'}
          sx={{
            borderRadius: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 24, sm: 28 },
          }}
        />
      </Box>

      {/* Тип обращения */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          lineHeight: 1.3,
          mb: 0.5,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {type}
      </Typography>

      {/* Описание */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8rem' },
            lineHeight: 1.4,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>
      )}

      {/* Инициатор, дата, исполнитель */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatDate(createdAt)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export { SupportRequestCard };