import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const statusColors = {
  'Новая': 'default',
  'В работе': 'info',
  'На уточнении': 'warning',
  'Закрыта': 'success',
};

export const RequestCard = ({ request, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          transform: isMobile ? 'none' : 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out',
        },
        borderRadius: { xs: 1.5, sm: 2 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          {request.id}
        </Typography>
        <Chip
          label={request.status}
          size="small"
          color={statusColors[request.status] || 'default'}
          sx={{
            borderRadius: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 24, sm: 28 },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          lineHeight: 1.3,
          mb: 0.5,
        }}
      >
        {request.type}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.8rem' },
          lineHeight: 1.4,
          mb: 1,
        }}
      >
        {request.description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {formatDate(request.date)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Исполнитель: {request.assignee}
        </Typography>
      </Box>
    </Paper>
  );
};