import React from 'react'
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material'

const SkillsInfoBlock = () => {
  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'PostgreSQL', level: 70 }
  ]

  const certifications = [
    'AWS Certified Developer',
    'React Professional',
    'Scrum Master'
  ]

  return (
    <Card>
      <CardContent>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Технические навыки
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {skills.map((skill, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{skill.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {skill.level}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={skill.level} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Сертификаты
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {certifications.map((cert, index) => (
              <Chip key={index} label={cert} variant="outlined" size="small" />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SkillsInfoBlock