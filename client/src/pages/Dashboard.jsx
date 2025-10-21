import React from 'react'
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip
} from '@mui/material'
import {
  Announcement as NewsIcon,
  Event as EventIcon,
  Cake as BirthdayIcon,
  Link as LinkIcon
} from '@mui/icons-material'

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в Portal S
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Корпоративный портал с интеграцией ELMA365
      </Typography>

      <Grid container spacing={3}>
        {/* Новости */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NewsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Новости</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Новое обновление корпоративного портала
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Добавлены новые функции и улучшен интерфейс...
                </Typography>
                <Chip label="Обновление" size="small" sx={{ mt: 1 }} />
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Корпоративное мероприятие
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Приглашаем всех на корпоративную вечеринку...
                </Typography>
                <Chip label="Событие" size="small" sx={{ mt: 1 }} />
              </Paper>
            </CardContent>
            <CardActions>
              <Button size="small">Все новости</Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Быстрые ссылки */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LinkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Быстрые ссылки</Typography>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EventIcon />}
                    sx={{ mb: 1 }}
                  >
                    Заявка в техподдержку
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<BirthdayIcon />}
                    sx={{ mb: 1 }}
                  >
                    Заявка на отпуск
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LinkIcon />}
                    sx={{ mb: 1 }}
                  >
                    Заказ канцелярии
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EventIcon />}
                    sx={{ mb: 1 }}
                  >
                    Есть идея
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Дни рождения */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BirthdayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Дни рождения</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Сегодня: Анна Сидорова (Системный администратор)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Завтра: Михаил Козлов (Менеджер по продажам)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика портала
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary">
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Активных заявок
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="secondary">
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Новых уведомлений
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
