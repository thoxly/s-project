import React from 'react'
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material'
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const Breadcrumbs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    
    // Если глубина <= 1, не показываем крошки
    if (pathSegments.length <= 1) {
      return []
    }

    const items = []

    // Добавляем остальные сегменты пути
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const isLast = index === pathSegments.length - 1
      
      let label = segment
      switch (segment) {
        case 'profile':
          label = 'Профиль'
          break
        case 'services':
          label = 'Сервисы'
          break
        case 'knowledge':
          label = 'База знаний'
          break
        case 'org':
          label = 'Оргструктура'
          break
        default:
          // Для табов внутри профиля
          if (pathSegments[0] === 'profile') {
            switch (segment) {
              case 'calendar':
                label = 'Календарь'
                break
              case 'tasks':
                label = 'Задачи'
                break
              case 'messenger':
                label = 'Мессенджер'
                break
              case 'applications':
                label = 'Заявки'
                break
              case 'colleagues':
                label = 'Коллеги'
                break
              case 'ideas':
                label = 'Идеи'
                break
              default:
                label = segment
            }
          }
      }

      items.push({
        label,
        path,
        isLast
      })
    })

    return items
  }

  const breadcrumbItems = getBreadcrumbItems()

  // Если нет элементов для отображения, не рендерим компонент
  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary'
          }
        }}
      >
        {breadcrumbItems.map((item, index) => {
          if (item.isLast) {
            return (
              <Typography
                key={index}
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {item.label}
              </Typography>
            )
          }

          return (
            <Link
              key={index}
              component="button"
              variant="body2"
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '0.9rem',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.dark'
                }
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </MuiBreadcrumbs>
    </Box>
  )
}

export default Breadcrumbs
