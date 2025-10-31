import React, { useState } from 'react'
import { 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button
} from '@mui/material'
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material'

const PersonalInfoBlock = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  
  // Данные пользователя
  const [userData, setUserData] = useState({
    fullName: "Столяров Антон Сергеевич",
    position: "Ведущий разработчик",
    organization: "ООО «Сириус Технологии»",
    birthDate: "15.03.1985",
    phone: "+7 (928) 555-12-34",
    email: "a.stolyarov@sirius-tech.ru",
    gender: "Мужской",
    department: "Отдел разработки",
    status: "Активен"
  })

  const [editData, setEditData] = useState({ ...userData })

  const handleEditOpen = () => {
    setEditData({ ...userData })
    setEditDialogOpen(true)
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
  }

  const handleSave = () => {
    setUserData({ ...editData })
    setEditDialogOpen(false)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleInputChange = (field) => (event) => {
    setEditData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  return (
    <Box>
      {/* Аватар и основная информация */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          position: 'relative'
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            bgcolor: "primary.main",
            fontSize: "2rem",
            fontWeight: 700,
            border: "2px solid",
            borderColor: "primary.light",
          }}
        >
          <PersonIcon sx={{ fontSize: "2rem" }} />
        </Avatar>
        
        {/* Кнопка редактирования - позиционируем над аватаром */}
        <IconButton
          size="small"
          onClick={handleEditOpen}
          sx={{
            position: 'absolute',
            top: -8,
            right: 0,
            color: 'primary.main',
            backgroundColor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            textAlign: "center",
            mb: 0.5,
            fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
            letterSpacing: "0.01em",
            fontSize: '1.1rem'
          }}
        >
          {userData.fullName}
        </Typography>
        <Chip
          label={userData.position}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Информация о сотруднике */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <WorkIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Должность
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.position}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <BusinessIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Организация
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.organization}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <CakeIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Дата рождения
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.birthDate}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <PhoneIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Телефон
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.phone}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <EmailIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Email
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.email}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Дополнительные поля */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <PersonIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Пол
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.gender}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <BusinessIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Отдел
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                  fontSize: '0.9rem'
                }}
              >
                {userData.department}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <WorkIcon
              sx={{ mr: 1.5, color: "text.secondary", fontSize: 18 }}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: 0.2 }}
              >
                Статус
              </Typography>
              <Chip 
                label={userData.status} 
                color={userData.status === "Активен" ? "success" : "default"} 
                size="small" 
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Диалог редактирования в стиле страницы */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Редактировать профиль
          </Typography>
          <IconButton onClick={handleEditClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="ФИО"
                value={editData.fullName}
                onChange={handleInputChange('fullName')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Должность"
                value={editData.position}
                onChange={handleInputChange('position')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Организация"
                value={editData.organization}
                onChange={handleInputChange('organization')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Дата рождения"
                value={editData.birthDate}
                onChange={handleInputChange('birthDate')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                placeholder="ДД.ММ.ГГГГ"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Пол</InputLabel>
                <Select
                  value={editData.gender}
                  label="Пол"
                  onChange={handleInputChange('gender')}
                >
                  <MenuItem value="Мужской">Мужской</MenuItem>
                  <MenuItem value="Женский">Женский</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Телефон"
                value={editData.phone}
                onChange={handleInputChange('phone')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                value={editData.email}
                onChange={handleInputChange('email')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Отдел"
                value={editData.department}
                onChange={handleInputChange('department')}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={editData.status}
                  label="Статус"
                  onChange={handleInputChange('status')}
                >
                  <MenuItem value="Активен">Активен</MenuItem>
                  <MenuItem value="Неактивен">Неактивен</MenuItem>
                  <MenuItem value="В отпуске">В отпуске</MenuItem>
                  <MenuItem value="Удаленная работа">Удаленная работа</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleEditClose}
            sx={{ 
              textTransform: 'none',
              borderRadius: 1,
              fontWeight: 500
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              fontWeight: 500
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомление об успешном сохранении */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ borderRadius: 1 }}
        >
          Информация обновлена
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PersonalInfoBlock