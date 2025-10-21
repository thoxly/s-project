import React from 'react'
import { Typography, Paper, Box } from '@mui/material'

const KnowledgeBase = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        База знаний
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Страница базы знаний (E7 - в разработке)
        </Typography>
      </Paper>
    </Box>
  )
}

export default KnowledgeBase
