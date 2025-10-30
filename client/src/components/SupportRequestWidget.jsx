import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации
import { RequestCard } from './RequestCard';
import { HelpOutline as SupportIcon, SupportAgent as SupportAgentIcon } from '@mui/icons-material';

const SupportRequestsWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Хук для навигации
  const navigate = useNavigate();

  // Состояния для выпадающего меню
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    // Переход на страницу /services
    navigate('/services');
    handleClose(); // Закрываем меню
  };

  useEffect(() => {
    fetch('/mock/supportRequests.json')
      .then((response) => response.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки заявок:', error);
        setRequests([]); // В демо — можно показать пустой список
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={isMobile ? '80px' : '100px'}>
        <Typography variant={isMobile ? 'body2' : 'body1'}>Загрузка заявок...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {requests.length === 0 && (
          <div>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              onClick={handleClick} // ← Открывает меню
              sx={{
                borderRadius: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: isMobile ? 'none' : 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(30, 58, 138, 0.2)',
                },
              }}
            >
              + Заявка
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 4,
                sx: { borderRadius: 2 },
              }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuItemClick}>
                <ListItemIcon>
                  <SupportAgentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Заявка в техподдержку" />
              </MenuItem>
            </Menu>
          </div>
        )}
      </Box>

      {requests.length > 0 ? (
        <Box>
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => {
                // В демо — показываем уведомление
                alert('Недоступно в демо-версии');
              }}
            />
          ))}
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'grey.400',
            backgroundColor: 'rgba(245, 245, 245, 0.3)',
            borderRadius: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            У вас пока нет заявок в техподдержку
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SupportRequestsWidget;