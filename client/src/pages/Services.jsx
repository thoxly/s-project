import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Container, Fade } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ServiceColumn from '../components/ServiceColumn';
import mockData from '../mock/services.json';

const Services = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('serviceOrder');
    return saved ? JSON.parse(saved) : mockData.categories;
  });
  const [activeId, setActiveId] = useState(null);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('serviceOrder', JSON.stringify(categories));
  }, [categories]);

  // Sensors для drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Обработчики drag-and-drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Найти, в какой категории находится активная карточка
      const activeCategoryIndex = categories.findIndex(cat =>
        cat.services.some(s => s.id === active.id)
      );
      if (activeCategoryIndex === -1) return;

      const newCategories = [...categories];
      const activeCategory = newCategories[activeCategoryIndex];

      const oldIndex = activeCategory.services.findIndex(s => s.id === active.id);
      const newIndex = activeCategory.services.findIndex(s => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        newCategories[activeCategoryIndex].services = arrayMove(
          newCategories[activeCategoryIndex].services,
          oldIndex,
          newIndex
        );

        setCategories(newCategories);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Найти активную карточку для DragOverlay
  const activeService = activeId
    ? categories.flatMap(cat => cat.services).find(s => s.id === activeId)
    : null;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Заголовок страницы */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.1) 0%, rgba(30, 60, 147, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgb(30, 60, 147) 0%, rgb(45, 85, 180) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Каталог заявок
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Быстрый доступ к корпоративным сервисам
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} md={4} key={category.id}>
                <SortableContext
                  items={category.services.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ServiceColumn
                    id={category.id}
                    title={category.title}
                    services={category.services}
                  />
                </SortableContext>
              </Grid>
            ))}
          </Grid>

          {/* DragOverlay для плавного перетаскивания */}
          <DragOverlay>
            {activeService ? (
              <Box
                sx={{
                  width: 320,
                  borderRadius: 3,
                  background: 'white',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  p: 2,
                  cursor: 'grabbing',
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {activeService.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeService.desc}
                </Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </Box>
  );
};

export default Services;