import { Modal, Box, Typography, Button } from '@mui/material';

export const ServiceDetailModal = ({ open, onClose, title, desc, category }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {desc}
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Категория: {category}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>
          Закрыть
        </Button>
      </Box>
    </Modal>
  );
};