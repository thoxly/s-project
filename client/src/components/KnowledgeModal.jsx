// components/KnowledgeModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
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

export const KnowledgeModal = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 420,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {docIcons[data.type]}
          <Typography variant="h6" fontWeight={600}>
            {data.title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {data.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {data.type === 'link' ? 'Перейти' : 'Скачать'}
        </Button>
      </Box>
    </Modal>
  );
};
