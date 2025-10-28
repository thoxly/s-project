// components/KnowledgeCard.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  PictureAsPdfOutlined as PdfIcon,
  LinkOutlined as LinkIcon,
  VideoLibraryOutlined as VideoIcon,
  ArticleOutlined as WikiIcon,
} from '@mui/icons-material';

const docIcons = {
  pdf: <PdfIcon color="error" />,
  video: <VideoIcon color="primary" />,
  link: <LinkIcon color="success" />,
  wiki: <WikiIcon color="info" />,
};

const KnowledgeCard = ({ title, description, type, onOpen }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2.5,
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      transition: 'all 0.25s ease',
      border: '1px solid rgba(30,60,147,0.08)',
      '&:hover': {
        boxShadow: '0 6px 18px rgba(30,60,147,0.15)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {docIcons[type]}
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 1.5, flex: 1, minHeight: 50 }}
    >
      {description}
    </Typography>
    <Button
      variant="outlined"
      onClick={() => onOpen({ title, description, type })}
      sx={{
        mt: 2,
        borderRadius: 2,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
        },
      }}
    >
      Открыть
    </Button>
  </Paper>
);

export default KnowledgeCard;