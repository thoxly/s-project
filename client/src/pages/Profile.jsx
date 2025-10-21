import React from 'react'
import { Typography, Paper, Box } from '@mui/material'

const Profile = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Личный кабинет
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Страница личного кабинета сотрудника (E3 - в разработке)
        </Typography>
      </Paper>
    </Box>
  )
}

export default Profile
