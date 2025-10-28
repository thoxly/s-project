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
  Tooltip,
  useMediaQuery,
  useTheme
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
  isEditMode = false,
  enableWidthToggle = true,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
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
            borderRadius: { xs: 2, sm: 4 },
            overflow: 'hidden',
            background: isDragging 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)' 
              : 'white',
            backdropFilter: isDragging ? 'blur(10px)' : 'none',
            boxShadow: isDragging 
              ? "0 20px 40px rgba(30, 58, 138, 0.3), 0 0 0 2px rgba(30, 58, 138, 0.2)" 
              : isMobile 
                ? "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)"
                : "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
            opacity: isDragging ? 0.95 : 1,
            scale: isDragging ? (isMobile ? '1.02' : '1.03') : '1',
            transition: isDragging 
              ? 'box-shadow 200ms ease, opacity 200ms ease, scale 200ms ease' 
              : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: isEditMode ? 'transform' : 'auto',
            // В режиме ширины=2 визуально усиливаем карточку
            ...(width === 2 ? {
              boxShadow: isMobile 
                ? "0 4px 12px rgba(0,0,0,0.15)"
                : "0 6px 18px rgba(0,0,0,0.12)",
              borderRadius: { xs: 3, sm: 6 },
              transform: isDragging ? undefined : 'translateZ(0)',
            } : {}),
            "&:hover": {
              boxShadow: isEditMode 
                ? "0 8px 24px rgba(30, 58, 138, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)"
                : isMobile
                  ? "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.1)"
                  : "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
              transform: !isDragging && !isEditMode ? (isMobile ? 'translateY(-2px)' : 'translateY(-4px)') : 'none',
            },
            // Добавляем красивую границу сверху
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: { xs: '3px', sm: '4px' },
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
                p: { xs: 2, sm: 2.5 },
                pt: { xs: 2.5, sm: 3 },
                background: isDragging 
                  ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 64, 175, 0.03) 100%)'
                  : 'transparent',
                cursor: isEditMode ? 'grab' : 'default',
                '&:active': {
                  cursor: isEditMode ? 'grabbing' : 'default'
                },
                transition: 'background 200ms ease',
                minHeight: { xs: 60, sm: 70 }
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
                      mr: { xs: 1.5, sm: 2 },
                      p: { xs: 0.75, sm: 1 },
                      borderRadius: { xs: 1.5, sm: 2 },
                      color: 'text.secondary',
                      backgroundColor: 'rgba(30, 58, 138, 0.08)',
                      transition: 'all 200ms ease',
                      minWidth: { xs: 32, sm: 40 },
                      minHeight: { xs: 32, sm: 40 },
                      '&:hover': {
                        backgroundColor: 'rgba(30, 58, 138, 0.15)',
                        color: 'primary.main',
                        transform: isMobile ? 'scale(1.05)' : 'scale(1.1)',
                      }
                    }}
                  >
                    <DragIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Box>
                </Fade>
              )}

              {/* Иконка с градиентом */}
              <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${color}.main`,
                    background: `linear-gradient(135deg, ${color}.main 0%, ${color}.dark 100%)`,
                    mr: { xs: 1.5, sm: 2 }, 
                    width: { xs: 36, sm: 42 }, 
                    height: { xs: 36, sm: 42 },
                    boxShadow: `0 4px 12px ${color === 'primary' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                    '&:hover': {
                      transform: isMobile ? 'rotate(5deg) scale(1.05)' : 'rotate(10deg) scale(1.1)',
                    }
                  }}
                >
                  {icon}
                </Avatar>
              </Zoom>
              
              <Typography 
                variant={isMobile ? "body1" : "h6"}
                sx={{ 
                  fontWeight: 400, 
                  flex: 1,
                  color: 'text.primary',
                  letterSpacing: '0.01em',
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: { xs: '0.9rem', sm: '1.25rem' },
                  lineHeight: { xs: 1.3, sm: 1.2 }
                }}
              >
                {title}
              </Typography>

              {/* Кнопка изменения ширины - только в режиме редактирования и если включена */}
              {isEditMode && enableWidthToggle && onToggleWidth && (
                <Tooltip title={width === 2 ? "Стандартная ширина" : "Двойная ширина"} placement="top">
                  <IconButton
                    onClick={handleWidthToggle}
                    size={isMobile ? "small" : "small"}
                    sx={{
                      mr: { xs: 0.5, sm: 1 },
                      color: width === 2 ? 'primary.main' : 'text.secondary',
                      backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.1)' : 'transparent',
                      borderRadius: { xs: 1.5, sm: 2 },
                      transition: 'all 200ms ease',
                      minWidth: { xs: 32, sm: 40 },
                      minHeight: { xs: 32, sm: 40 },
                      '&:hover': {
                        backgroundColor: width === 2 ? 'rgba(30, 58, 138, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                        color: 'primary.main',
                        transform: isMobile ? 'scale(1.05)' : 'scale(1.1)',
                      }
                    }}
                  >
                    {width === 2 ? 
                      <ViewDayIcon sx={{ fontSize: { xs: 16, sm: 20 } }} /> : 
                      <ViewColumnIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                    }
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Содержимое - всегда раскрыто */}
            <Box 
              sx={{ 
                p: width === 2 ? { xs: 2, sm: 3 } : { xs: 2, sm: 2.5 },
                pt: width === 2 ? { xs: 1.5, sm: 2 } : { xs: 1, sm: 1 },
                minHeight: isEditMode ? (width === 2 ? { xs: 120, sm: 160 } : { xs: 100, sm: 120 }) : 'auto',
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
                top: { xs: 8, sm: 12 },
                right: { xs: 8, sm: 12 },
                width: { xs: 6, sm: 8 },
                height: { xs: 6, sm: 8 },
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
