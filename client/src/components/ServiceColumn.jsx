import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import ServiceCard from './ServiceCard';

// Импортируем иконки
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// Иконки по ID категории
const categoryIcons = {
  managers: WorkIcon,      // Briefcase
  employees: PeopleIcon,   // Users
  'it-support': SupportAgentIcon, // MonitorCog
};

const ServiceColumn = ({ id, title, services }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'container' },
  });

  const IconComponent = categoryIcons[id] || WorkIcon; // Дефолтная иконка

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        borderRadius: 3,
        background: 'white',
        boxShadow: isOver
          ? '0 6px 16px rgba(30, 58, 138, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: isOver
          ? '2px dashed #1e3a8a'
          : '1px solid rgba(0,0,0,0.08)',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconComponent fontSize="small" color="primary" />
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      {services.length > 0 ? (
        services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            desc={service.desc}
            category={id}
          />
        ))
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
            fontStyle: 'italic',
          }}
        >
          Нет карточек
        </Box>
      )}
    </Paper>
  );
};

export default ServiceColumn;