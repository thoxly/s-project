import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Services from './pages/Services'
import KnowledgeBase from './pages/KnowledgeBase'
import OrgStructure from './pages/OrgStructure'

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      <Navbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/org" element={<OrgStructure />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
