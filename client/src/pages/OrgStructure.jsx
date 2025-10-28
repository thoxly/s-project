import React, { useState } from 'react';
import { Typography, Paper, Box, Button, Fade, Container, Slide } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import orgstructure from './../mock/orgstructure.json';
import employees from './../mock/employees.json';
import { CustomTreeItem } from './../components/CustomTreeItem';
import avatarurl from './../pictures/gettyimages-87338287-612x612.jpg';
import { OrgSideBar } from '../components/OrgSideBar';
import { EmployeeSearch } from '../components/EmployeeSearch';
import { EmployeeModal } from '../components/EmployeeModal';
import { useGlobalState } from '../store/GlobalContext';
const OrgStructure = () => {
  const { state, dispatch } = useGlobalState(); // получаем состояние и dispatch
  const [employeeModal, setEmployeeModal] = useState({
    open: false,
    employeeData: null
  });

  const handleDepartmentClick = (departmentData) => {
    // Получаем ID отдела из данных
    const departmentId = departmentData.id ? departmentData.id.toString() : null;
    const departmentEmployees = departmentId ? employees[departmentId] || [] : [];
    
    // Открываем боковую панель с информацией об отделе
    dispatch({
      type: 'OPEN_SIDEBAR',
      payload: {
        avatarUrl: null,
        fullName: departmentData.label,
        position: `Отдел (${departmentEmployees.length} сотрудников)`,
        department: 'Подразделение',
        phone: '—',
        workPhone: '—',
        email: '—',
        employees: departmentEmployees, // добавляем список сотрудников
        isDepartment: true, // флаг что это отдел
      },
    });
  };

  const handleEmployeeClick = (employeeData) => {
    setEmployeeModal({
      open: true,
      employeeData: employeeData
    });
  };

  const handleCloseEmployeeModal = () => {
    setEmployeeModal({
      open: false,
      employeeData: null
    });
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Заголовок страницы */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.1) 0%, rgba(30, 60, 147, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountTreeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgb(30, 60, 147) 0%, rgb(45, 85, 180) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Организационная структура
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Быстрый поиск и контакты сотрудников
                </Typography>
              </Box>
            </Box>

            {/* Компонент поиска */}
            <EmployeeSearch 
              orgData={orgstructure} 
              employeesData={employees} 
              onEmployeeClick={handleEmployeeClick}
            />
          </Box>
        </Fade>

        {/* Дерево организационной структуры */}
        <Slide in direction="up" timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <RichTreeView
              items={orgstructure}
              getItemLabel={(item) => item.label}
              slots={{
                item: (props) => <CustomTreeItem {...props} onDepartmentClick={handleDepartmentClick} />,
              }}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultCollapseIcon={<ExpandMoreIcon />}
            />
          </Paper>
        </Slide>
      </Container>

      {/* === ПАНЕЛЬ ОРГСАЙДБАР === */}
      {state.sidebarOpen && (
        <>
          {/* Backdrop - затемнение фона */}
          <Box
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1299,
              animation: 'fadeIn 0.3s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          />
          
          {/* Боковая панель */}
          <Slide in direction="left" timeout={300}>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: { xs: '100%', sm: 440 },
                zIndex: 1300,
                backgroundColor: 'background.default',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.25)',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              {state.sidebarData && (
                <OrgSideBar
                  {...state.sidebarData}
                  onClose={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
                  onEmployeeClick={handleEmployeeClick}
                />
              )}
            </Box>
          </Slide>
        </>
      )}

      {/* === МОДАЛЬНОЕ ОКНО СОТРУДНИКА === */}
      <EmployeeModal
        open={employeeModal.open}
        onClose={handleCloseEmployeeModal}
        {...employeeModal.employeeData}
      />
    </Box>
  );
};

export default OrgStructure;