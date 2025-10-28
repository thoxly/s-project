// components/EmployeeSearch.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  InputAdornment,
  Chip,
  Fade,
  Zoom,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
export const EmployeeSearch = ({ orgData, employeesData, onEmployeeClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Функция для извлечения всех сотрудников из новой структуры данных
  const extractEmployees = (orgData, employeesData) => {
    let allEmployees = [];
    
    // Проходим по всем отделам и их сотрудникам
    Object.keys(employeesData).forEach(departmentId => {
      const departmentEmployees = employeesData[departmentId];
      const departmentName = getDepartmentName(orgData, departmentId);
      
      departmentEmployees.forEach(employee => {
        allEmployees.push({
          ...employee,
          departmentName: departmentName,
          path: [departmentName]
        });
      });
    });
    
    return allEmployees;
  };

  // Функция для получения названия отдела по ID
  const getDepartmentName = (orgData, departmentId) => {
    const findDepartment = (nodes) => {
      for (const node of nodes) {
        try {
          const data = JSON.parse(node.label);
          if (data.id === parseInt(departmentId) || node.id === parseInt(departmentId)) {
            return data.label;
          }
          if (node.children && node.children.length > 0) {
            const found = findDepartment(node.children);
            if (found) return found;
          }
        } catch (e) {
          console.error('Error parsing node:', e);
        }
      }
      return 'Неизвестный отдел';
    };
    
    return findDepartment(orgData);
  };

  // Мемоизируем список всех сотрудников
  const allEmployees = useMemo(() => extractEmployees(orgData, employeesData), [orgData, employeesData]);

  // Поиск сотрудников
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return allEmployees
      .filter((emp) => {
        return (
          emp.fullName?.toLowerCase().includes(query) ||
          emp.position?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.phone?.toLowerCase().includes(query) ||
          emp.work_phone?.toLowerCase().includes(query)
        );
      })
      .slice(0, 8); // Ограничиваем до 8 результатов
  }, [searchQuery, allEmployees]);

  // Закрываем результаты при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmployeeClick = (employee) => {
    if (onEmployeeClick) {
      onEmployeeClick({
        avatarUrl: employee.avatarUrl,
        fullName: employee.fullName,
        position: employee.position,
        department: employee.path[0] || 'Не указано',
        phone: employee.phone,
        workPhone: employee.work_phone,
        email: employee.email,
      });
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <Box className="search-container" sx={{ position: 'relative', mb: 3 }}>
      {/* Поисковое поле */}
      <TextField
        fullWidth
        placeholder="Поиск сотрудника по имени, должности, телефону или email..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => searchQuery && setShowResults(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearSearch}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(30, 60, 147, 0.15)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(30, 60, 147, 0.25)',
            },
          },
        }}
      />

      {/* Статистика */}
      <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip
          label={`Всего сотрудников: ${allEmployees.length}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(30, 60, 147, 0.1)',
            color: 'primary.main',
            fontWeight: 500,
          }}
        />
        {searchQuery && (
          <Fade in>
            <Chip
              label={`Найдено: ${searchResults.length}`}
              size="small"
              color="success"
              sx={{ fontWeight: 500 }}
            />
          </Fade>
        )}
      </Box>

      {/* Результаты поиска */}
      {showResults && searchQuery && searchResults.length > 0 && (
        <Zoom in timeout={200}>
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 500,
              overflow: 'auto',
              zIndex: 1400,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <List sx={{ p: 0 }}>
              {searchResults.map((employee, index) => (
                <ListItem
                  key={employee.id}
                  button
                  onClick={() => handleEmployeeClick(employee)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    transition: 'all 0.2s ease',
                    borderBottom:
                      index < searchResults.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 60, 147, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={employee.avatarUrl}
                      sx={{
                        width: 56,
                        height: 56,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {employee.avatarUrl ? null : (
                        <PersonOutlined sx={{ fontSize: '1.8rem', color: 'white' }} />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                        {employee.fullName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {employee.position}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                          {employee.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {employee.phone}
                              </Typography>
                            </Box>
                          )}
                          {employee.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EmailIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {employee.email}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Zoom>
      )}

      {/* Нет результатов */}
      {showResults && searchQuery && searchResults.length === 0 && (
        <Fade in>
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              p: 4,
              zIndex: 1400,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              Сотрудник не найден
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Попробуйте изменить запрос
            </Typography>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

