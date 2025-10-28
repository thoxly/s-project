import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
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
    <Box sx={{ p: 3 }}>
      <Typography sx={{ padding: '0 0 12px 0' }} variant="h4" gutterBottom>
        Каталог заявок
      </Typography>

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
    </Box>
  );
};

export default Services;