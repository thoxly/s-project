import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Card,
  CardContent,
  Box,
  IconButton,
  Typography,
  Avatar,
  Zoom,
  Fade,
  Tooltip
} from '@mui/material'
import {
  DragIndicator as DragIcon,
  ViewColumn as ViewColumnIcon,
  ViewDay as ViewDayIcon
} from '@mui/icons-material'

const DraggableCard = ({ 
  id, 
  index, 
  title, 
  icon, 
  children, 
  onToggleWidth,
  width = 1,
  color = 'primary',
  isEditMode = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isEditMode 
  })

  const handleWidthToggle = (e) => {
    e.stopPropagation()
    if (onToggleWidth) {
      onToggleWidth(id)
    }
  }

  // Разделяем transform для избежания конфликтов
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  }

  return (
        <Card
          ref={setNodeRef}
          style={style}
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            background: isDragging 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)' 
              : 'white',
            backdropFilter: isDragging ? 'blur(10px)' : 'none',
            boxShadow: isDragging 
              ? "0 20px 40px rgba(30, 58, 138, 0.3), 0 0 0 2px rgba(30, 58, 138, 0.2)" 
              : "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
            opacity: isDragging ? 0.95 : 1,
            scale: isDragging ? '1.03' : '1',
            transition: isDragging 
              ? 'box-shadow 200ms ease, opacity 200ms ease, scale 200ms ease' 
              : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: isEditMode ? 'transform' : 'auto',
            "&:hover": {
              boxShadow: isEditMode 
                ? "0 8px 24px rgba(30, 58, 138, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
              transform: !isDragging && !isEditMode ? 'translateY(-4px)' : 'none',
            },
            // Добавляем красивую границу сверху
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${color}.main, ${color}.light)`,
              opacity: isDragging ? 1 : 0.7,
              transition: 'opacity 300ms ease',
            }
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Заголовок с drag handle */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2.5,
                pt: 3,
                background: isDragging 
                  ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 64, 175, 0.03) 100%)'
                  : 'transparent',
                cursor: isEditMode ? 'grab' : 'default',
                '&:active': {
                  cursor: isEditMode ? 'grabbing' : 'default'
                },
                transition: 'background 200ms ease',
              }}
              {...(isEditMode ? { ...attributes, ...listeners } : {})}
            >
              {/* Drag handle - только в режиме редактирования */}
              {isEditMode && (
                <Fade in={isEditMode} timeout={300}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      p: 1,
                      borderRadius: 2,
                      color: 'text.secondary',
                      backgroundColor: 'rgba(30, 58, 138, 0.08)',
                      transition: 'all 200ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(30, 58, 138, 0.15)',
                        color: 'primary.main',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <DragIcon />
                  </Box>
                </Fade>
              )}

              {/* Иконка с градиентом */}
              <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${color}.main`,
                    background: `linear-gradient(135deg, ${color}.main 0%, ${color}.dark 100%)`,
                    mr: 2, 
                    width: 42, 
                    height: 42,
                    boxShadow: `0 4px 12px ${color === 'primary' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                    '&:hover': {
                      transform: 'rotate(10deg) scale(1.1)',
                    }
                  }}
                >
                  {icon}
                </Avatar>
              </Zoom>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  flex: 1,
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>

              {/* Кнопка изменения ширины - только в режиме редактирования */}
              {isEditMode && onToggleWidth && (
                <Tooltip title={width === 2 ? "Стандартная ширина" : "Двойная ширина"} placement="top">
                  <IconButton
                    onClick={handleWidthToggle}
                    size="small"
                    sx={{
                      mr: 1,
                      color: width === 2 ? 'primary.main' : 'text.secondary',
                      backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.1)' : 'transparent',
                      borderRadius: 2,
                      transition: 'all 200ms ease',
                      '&:hover': {
                        backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                        color: 'primary.main',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    {width === 2 ? <ViewDayIcon fontSize="small" /> : <ViewColumnIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Содержимое - всегда раскрыто */}
            <Box 
              sx={{ 
                p: 2.5,
                pt: 1,
                minHeight: isEditMode ? 120 : 'auto',
                background: isEditMode 
                  ? 'linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, white 100%)'
                  : 'transparent',
              }}
            >
              {children}
            </Box>
          </CardContent>

          {/* Индикатор режима редактирования */}
          {isEditMode && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.6,
                    transform: 'scale(1.2)',
                  },
                },
              }}
            />
          )}
        </Card>
  )
}

export default DraggableCard
