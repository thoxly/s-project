import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  IconButton,
  Grid
} from '@mui/material'
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  Sports as SportsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'

const AboutMeBlock = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    bio: 'Увлеченный разработчик с опытом работы в веб-технологиях. Люблю изучать новые технологии и делиться знаниями с коллегами.',
    interests: ['Программирование', 'Путешествия', 'Фотография', 'Чтение', 'Спорт'],
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'UI/UX Design'],
    achievements: ['Лучший сотрудник месяца', 'Завершил сложный проект', 'Провел успешный воркшоп']
  })
  
  const [newInterest, setNewInterest] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [newAchievement, setNewAchievement] = useState('')

  // Функции для интересов
  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(interest => interest !== interestToRemove)
    })
  }

  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter') {
      addInterest()
    }
  }

  // Функции для навыков
  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill()
    }
  }

  // Функции для достижений
  const addAchievement = () => {
    if (newAchievement.trim() && !profile.achievements.includes(newAchievement.trim())) {
      setProfile({
        ...profile,
        achievements: [...profile.achievements, newAchievement.trim()]
      })
      setNewAchievement('')
    }
  }

  const removeAchievement = (achievementToRemove) => {
    setProfile({
      ...profile,
      achievements: profile.achievements.filter(achievement => achievement !== achievementToRemove)
    })
  }

  const handleAchievementKeyPress = (e) => {
    if (e.key === 'Enter') {
      addAchievement()
    }
  }

  // Функции сохранения и отмены
  const handleSave = () => {
    setIsEditing(false)
    // Здесь можно добавить логику сохранения на сервер
    console.log('Сохраненные данные:', profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Сброс к исходным данным (в реальном приложении нужно загружать исходные данные)
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <InfoIcon sx={{ mr: 1, color: "info.main" }} />
          Расскажи о себе
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {!isEditing && (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Редактировать
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FavoriteIcon sx={{ mr: 1, fontSize: 18, color: 'primary.main' }} />
              О себе
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                variant="outlined"
                placeholder="Расскажите о своих увлечениях, целях и интересах..."
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6 }}
              >
                {profile.bio}
              </Typography>
            )}
          </Grid>

          {/* Интересы с редактированием */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FavoriteIcon sx={{ mr: 1, fontSize: 18, color: 'secondary.main' }} />
              Интересы
            </Typography>
            {isEditing ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={handleInterestKeyPress}
                    placeholder="Добавить интерес..."
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={addInterest}
                    disabled={!newInterest.trim()}
                    size="small"
                    sx={{
                      bgcolor: "secondary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "secondary.dark",
                      },
                      "&:disabled": {
                        bgcolor: "grey.300",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {profile.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onDelete={() => removeInterest(interest)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {profile.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Навыки с редактированием */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <SchoolIcon sx={{ mr: 1, fontSize: 18, color: 'success.main' }} />
              Навыки
            </Typography>
            {isEditing ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Добавить навык..."
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    size="small"
                    sx={{
                      bgcolor: "success.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "success.dark",
                      },
                      "&:disabled": {
                        bgcolor: "grey.300",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {profile.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="success"
                      variant="outlined"
                      onDelete={() => removeSkill(skill)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {profile.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Достижения с редактированием */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <SportsIcon sx={{ mr: 1, fontSize: 18, color: 'warning.main' }} />
              Достижения
            </Typography>
            {isEditing ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={handleAchievementKeyPress}
                    placeholder="Добавить достижение..."
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={addAchievement}
                    disabled={!newAchievement.trim()}
                    size="small"
                    sx={{
                      bgcolor: "warning.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "warning.dark",
                      },
                      "&:disabled": {
                        bgcolor: "grey.300",
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {profile.achievements.map((achievement, index) => (
                    <Chip
                      key={index}
                      label={achievement}
                      size="small"
                      color="warning"
                      variant="outlined"
                      onDelete={() => removeAchievement(achievement)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {profile.achievements.map((achievement, index) => (
                  <Chip
                    key={index}
                    label={achievement}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #0288d1 0%, #0277bd 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0277bd 0%, #01579b 100%)",
                },
              }}
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Отмена
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Убедитесь, что есть экспорт по умолчанию
export default AboutMeBlock