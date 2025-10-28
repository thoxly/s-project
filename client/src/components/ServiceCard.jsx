import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ServiceDetailModal } from './ServiceDetailModal';
import { useState } from 'react';

const ServiceCard = ({ id, title, desc, category }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAlert = () => { alert('Недоступно в демонстрационном варианте'); }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Цвета по категории
  const categoryColors = {
    managers: 'primary',
    employees: 'secondary',
    'it-support': 'success',
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 1.5,
          cursor: 'grab',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {desc}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              onClick={handleOpen}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'grey.400', // Серая обводка
                color: 'grey.700',       // Серый текст
                '&:hover': {
                  borderColor: 'primary.main', // При наведении — синяя
                  color: 'primary.main',
                  backgroundColor: 'rgba(30, 58, 138, 0.05)', // Лёгкий фон
                },
              }}
            >
              Подробнее
            </Button>
            <Button
              onClick={handleAlert}
              size="small"
              variant="contained"
              color="primary"
            >
              Создать
            </Button>
          </Box>
        </CardContent>
      </Card>
      <ServiceDetailModal
        open={open}
        onClose={handleClose}
        title={title}
        desc={desc}
        category={category}
      />
    </>
  );
};

export default ServiceCard;