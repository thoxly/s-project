import React, { useState } from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import orgstructure from './../mock/orgstructure.json';
import { CustomTreeItem } from './../components/CustomTreeItem';
import avatarurl from './../pictures/gettyimages-87338287-612x612.jpg';
import { OrgSideBar } from '../components/OrgSideBar';
import { useGlobalState } from '../store/GlobalContext';
const OrgStructure = () => {
  const { state, dispatch } = useGlobalState(); // получаем состояние и dispatch

  const handleToggleSidebar = () => {
    if (state.sidebarOpen) {
      dispatch({ type: 'CLOSE_SIDEBAR' });
    } else {
      // Если нужно открыть с какими-то данными по умолчанию
      dispatch({
        type: 'OPEN_SIDEBAR',
        payload: {
          avatarUrl: null,
          fullName: 'Андрей Попов',
          position: 'Оператор',
          department: 'Отдел обслуживания',
          phone: '+7 (999) 123-45-67',
          workPhone: '123',
          email: 'andrey@example.com',
        },
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom>
        Организационная структура
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <RichTreeView
          items={orgstructure}
          getItemLabel={(item) => item.label}
          slots={{
            item: CustomTreeItem,
          }}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultCollapseIcon={<ExpandMoreIcon />}
        />
      </Paper>

      {/* === ПАНЕЛЬ ОРГСАЙДБАР === */}
      <Box
        sx={{
          position: 'fixed',
          top: '15%',
          right: '5%',
          width: state.sidebarOpen ? 420 : 0, // ← используем глобальное состояние
          zIndex: 1300,
          backgroundColor: 'background.default',
          boxShadow: state.sidebarOpen ? '-4px 0 20px rgba(0,0,0,0.15)' : 'none',
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        {state.sidebarOpen && state.sidebarData && (
          <OrgSideBar
            {...state.sidebarData} // ← передаём данные из глобального состояния
            onClose={() => dispatch({ type: 'CLOSE_SIDEBAR' })} // ← вызываем через dispatch
          />
        )}
      </Box>
    </Box>
  );
};

export default OrgStructure;