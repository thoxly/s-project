import React, { useState } from 'react'
import {
  Typography,
  Box,
  Card,
  Button,
  Fab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from '@mui/material'
import {
  Add as AddIcon,
  Lightbulb as LightbulbIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material'

// Компонент для отображения карточки идеи
const IdeaCard = ({ idea, onVote, onOpen }) => {
  return (
    <Card 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        }
      }}
      onClick={() => onOpen(idea)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
          {idea.title}
        </Typography>
        <Chip 
          icon={<LightbulbIcon />}
          label={idea.category}
          color={idea.category === 'Инновация' ? 'primary' : idea.category === 'Оптимизация' ? 'success' : 'warning'}
          size="small"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
        {idea.description}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUpIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {idea.votes} голосов
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CommentIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {idea.comments?.length || 0} комментариев
            </Typography>
          </Box>
        </Box>

        <Button
          variant={idea.voted ? "contained" : "outlined"}
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onVote(idea.id)
          }}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {idea.voted ? "Голос отдан" : "Поддержать"}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {idea.author.charAt(0)}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {idea.author}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {idea.date}
        </Typography>
      </Box>
    </Card>
  )
}

// Компонент комментария
const Comment = ({ comment }) => {
  return (
    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {comment.author.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.date}
            </Typography>
          </Box>
        }
        secondary={
          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
            {comment.text}
          </Typography>
        }
      />
    </ListItem>
  )
}

// Диалог детального просмотра идеи
const IdeaDetailDialog = ({ idea, open, onClose, onVote, onAddComment }) => {
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(idea.id, newComment.trim())
      setNewComment('')
    }
  }

  if (!idea) return null

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {idea.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3}>
          {/* Заголовок и мета-информация */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                icon={<LightbulbIcon />}
                label={idea.category}
                color={idea.category === 'Инновация' ? 'primary' : idea.category === 'Оптимизация' ? 'success' : 'warning'}
                size="small"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {idea.votes} голосов
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant={idea.voted ? "contained" : "outlined"}
                size="small"
                startIcon={<ThumbUpIcon />}
                onClick={() => onVote(idea.id)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                {idea.voted ? "Голос отдан" : "Поддержать"}
              </Button>
              
              <Tooltip title="Поделиться">
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Сохранить">
                <IconButton size="small">
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Автор и дата */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {idea.author.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="600">
                {idea.author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Опубликовано {idea.date}
              </Typography>
            </Box>
          </Box>

          {/* Описание идеи */}
          <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {idea.fullDescription || idea.description}
            </Typography>
          </Paper>

          {/* Блок комментариев */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommentIcon />
              Комментарии ({idea.comments?.length || 0})
            </Typography>

            {/* Форма добавления комментария */}
            <Box sx={{ mb: 3 }}>
              <TextField
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Напишите ваш комментарий..."
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Опубликовать
                </Button>
              </Box>
            </Box>

            {/* Список комментариев */}
            {idea.comments && idea.comments.length > 0 ? (
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ py: 0 }}>
                  {idea.comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <Comment comment={comment} />
                      {index < idea.comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CommentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Пока нет комментариев. Будьте первым!
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

// Диалог добавления новой идеи
const AddIdeaDialog = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [category, setCategory] = useState('Инновация')

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        fullDescription: fullDescription.trim() || description.trim(),
        category
      })
      setTitle('')
      setDescription('')
      setFullDescription('')
      setCategory('Инновация')
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Новая идея
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3}>
          <TextField
            label="Название идеи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            placeholder="Краткое описание вашей идеи..."
            sx={{ mt: 2 }}
          />
          
          <TextField
            label="Краткое описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
            placeholder="Краткое описание для карточки идеи..."
          />

          <TextField
            label="Подробное описание"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Подробно опишите вашу идею, её преимущества и потенциальный эффект..."
          />
          
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Категория
            </Typography>
            <Stack direction="row" spacing={1}>
              {['Инновация', 'Оптимизация', 'Улучшение'].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setCategory(cat)}
                  color={category === cat ? 'primary' : 'default'}
                  variant={category === cat ? 'filled' : 'outlined'}
                  clickable
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Опубликовать идею
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const IdeasTab = () => {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "Внедрение AI-ассистента для поддержки сотрудников",
      description: "Разработка интеллектуального помощника на основе искусственного интеллекта для автоматического ответа на частые вопросы сотрудников...",
      fullDescription: "Разработка интеллектуального помощника на основе искусственного интеллекта для автоматического ответа на частые вопросы сотрудников и помощи в решении рутинных задач. Ассистент сможет обрабатывать запросы на естественном языке, интегрироваться с внутренними системами компании и предоставлять персонализированные рекомендации. Это позволит сократить время на решение стандартных вопросов и повысить эффективность работы сотрудников.",
      category: "Инновация",
      votes: 24,
      comments: [
        {
          id: 1,
          author: "Мария Иванова",
          text: "Отличная идея! Особенно полезно для новых сотрудников, которые часто задают одни и те же вопросы.",
          date: "15.01.2024 14:30"
        },
        {
          id: 2,
          author: "Алексей Петров",
          text: "Поддерживаю! Думаю, стоит начать с HR-вопросов, а потом расширять функционал.",
          date: "15.01.2024 16:45"
        }
      ],
      voted: false,
      author: "Алексей Петров",
      date: "15.01.2024"
    },
    {
      id: 2,
      title: "Оптимизация процесса code review",
      description: "Внедрение автоматизированной системы проверки кода с предустановленными правилами и шаблонами...",
      fullDescription: "Внедрение автоматизированной системы проверки кода с предустановленными правилами и шаблонами для ускорения процесса ревью и повышения качества кода. Система будет автоматически проверять код на соответствие стандартам, выявлять потенциальные уязвимости и предлагать улучшения. Это сократит время code review на 40% и повысит общее качество кодовой базы.",
      category: "Оптимизация",
      votes: 18,
      comments: [
        {
          id: 1,
          author: "Дмитрий Сидоров",
          text: "Отличное предложение! Особенно важно для больших проектов.",
          date: "13.01.2024 10:15"
        }
      ],
      voted: true,
      author: "Мария Иванова",
      date: "12.01.2024"
    }
  ])

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState(null)

  const handleVote = (ideaId) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { 
            ...idea, 
            votes: idea.voted ? idea.votes - 1 : idea.votes + 1,
            voted: !idea.voted 
          }
        : idea
    ))
  }

  const handleAddIdea = (newIdea) => {
    const idea = {
      id: Math.max(...ideas.map(i => i.id)) + 1,
      ...newIdea,
      votes: 0,
      comments: [],
      voted: false,
      author: "Вы",
      date: new Date().toLocaleDateString('ru-RU')
    }
    setIdeas(prev => [idea, ...prev])
  }

  const handleOpenDetail = (idea) => {
    setSelectedIdea(idea)
    setDetailDialogOpen(true)
  }

  const handleAddComment = (ideaId, commentText) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? {
            ...idea,
            comments: [
              ...(idea.comments || []),
              {
                id: Math.max(...(idea.comments?.map(c => c.id) || [0])) + 1,
                author: "Вы",
                text: commentText,
                date: new Date().toLocaleString('ru-RU')
              }
            ]
          }
        : idea
    ))

    // Обновляем выбранную идею, если она открыта
    if (selectedIdea && selectedIdea.id === ideaId) {
      setSelectedIdea(prev => ({
        ...prev,
        comments: [
          ...(prev.comments || []),
          {
            id: Math.max(...(prev.comments?.map(c => c.id) || [0])) + 1,
            author: "Вы",
            text: commentText,
            date: new Date().toLocaleString('ru-RU')
          }
        ]
      }))
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Идеи
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Предложения и инновационные идеи от сотрудников
          </Typography>
        </Box>

        <Tooltip title="Предложить новую идею">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Новая идея
          </Button>
        </Tooltip>
      </Box>

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {ideas.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего идей
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {ideas.reduce((sum, idea) => sum + idea.votes, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего голосов
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {ideas.reduce((sum, idea) => sum + (idea.comments?.length || 0), 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Комментариев
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {Math.round(ideas.reduce((sum, idea) => sum + idea.votes, 0) / ideas.length) || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Средний рейтинг
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Список идей */}
      <Grid container spacing={3}>
        {ideas.map((idea, index) => (
          <Grid item xs={12} key={idea.id}>
            <IdeaCard 
              idea={idea} 
              onVote={handleVote}
              onOpen={handleOpenDetail}
            />
          </Grid>
        ))}
      </Grid>

      {/* Плавающая кнопка для мобильных устройств */}
      <Fab
        color="primary"
        onClick={() => setAddDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Диалог добавления идеи */}
      <AddIdeaDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddIdea}
      />

      {/* Диалог детального просмотра идеи */}
      <IdeaDetailDialog
        idea={selectedIdea}
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </>
  )
}

export default IdeasTab