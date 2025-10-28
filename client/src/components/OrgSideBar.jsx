// components/OrgSideBar.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  Stack,
  IconButton,
  Zoom,
  Grid,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import PeopleIcon from '@mui/icons-material/People';
import { EmployeeCard } from './EmployeeCard';

export const OrgSideBar = ({
  avatarText = '?',
  avatarUrl = null,
  fullName = 'Имя Фамилия',
  position = 'Должность не указана',
  department = 'Подразделение не указано',
  phone = '—',
  workPhone = '—',
  email = '—',
  openState = null,
  onClose = () => {},
  employees = [], // список сотрудников для отдела
  isDepartment = true, // всегда отдел
  onEmployeeClick = null, // обработчик клика по сотруднику
}) => {
  return (
    <>
      <Zoom in timeout={300}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(30, 60, 147, 0.2)',
            overflow: 'hidden',
            maxWidth: 420,
            mx: 'auto',
            backgroundColor: 'background.paper',
            position: 'relative',
          }}
        >
          {/* Верхняя часть с аватаром и именем */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.95) 0%, rgba(30, 60, 147, 0.85) 100%)',
              color: 'white',
              padding: '32px 24px 24px 24px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CloseIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: avatarUrl ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              ) : isDepartment ? (
                <ApartmentOutlined sx={{ fontSize: '3rem', color: 'white' }} />
              ) : avatarText ? (
                <Typography variant="h5" sx={{ color: 'white' }}>
                  {avatarText}
                </Typography>
              ) : (
                <PersonOutlined sx={{ fontSize: '3rem', color: 'white' }} />
              )}
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {fullName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {position}
            </Typography>
          </Box>


          {/* Основная информация */}
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Тип подразделения
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500} sx={{ pl: 3.5 }}>
                  {department}
                </Typography>
              </Box>

              <Divider />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Количество сотрудников
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500} sx={{ pl: 3.5 }}>
                  {employees.length} человек
                </Typography>
              </Box>
            </Stack>
          </CardContent>

          {/* Список сотрудников отдела */}
          {employees.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: 3, pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Сотрудники отдела
                  </Typography>
                </Box>
                <Grid container spacing={1.5}>
                  {employees.map((employee) => (
                    <Grid item xs={12} key={employee.id}>
                      <EmployeeCard
                        fullName={employee.fullName}
                        position={employee.position}
                        avatarUrl={employee.avatarUrl}
                        phone={employee.phone}
                        work_phone={employee.work_phone}
                        email={employee.email}
                        department={false}
                        onEmployeeClick={onEmployeeClick}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Card>
      </Zoom>
    </>
  );
};

