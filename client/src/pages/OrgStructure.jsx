// // SimpleOrgTree.jsx
// import React from 'react';
// import { Box, Paper, Typography, Avatar, Stack } from '@mui/material';
// import { RichTreeView } from '@mui/x-tree-view';
// import PersonOutlined from '@mui/icons-material/PersonOutlined';
// import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';

// // Простая "карточка" для сотрудника
// const PersonNode = ({ name, role }) => (
//   <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.7 }}>
//     <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light' }}>
//       <PersonOutlined sx={{ fontSize: '1.1rem', color: 'secondary.main' }} />
//     </Avatar>
//     <Box>
//       <Typography variant="body2" fontWeight={600} noWrap>
//         {name}
//       </Typography>
//       <Typography variant="caption" color="text.secondary" noWrap>
//         {role}
//       </Typography>
//     </Box>
//   </Stack>
// );

// // Простая "карточка" для подразделения
// const DepartmentNode = ({ name }) => (
//   <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.7 }}>
//     <ApartmentOutlined sx={{ color: 'text.secondary', fontSize: '1.3rem' }} />
//     <Typography variant="body2" noWrap>
//       {name}
//     </Typography>
//   </Stack>
// );

// const OrgStructure = () => {
//   const treeItems = [
//     {
//       id: '1',
//       parentId: null,
//       label: <PersonNode name="Иванов И.И." role="Глава администрации" />,
//     },
//     {
//       id: '2',
//       parentId: '1',
//       label: <PersonNode name="Петров П.П." role="Заместитель главы" />,
//     },
//     {
//       id: '3',
//       parentId: '2',
//       label: <DepartmentNode name="Департамент финансов" />,
//     },
//     {
//       id: '4',
//       parentId: '2',
//       label: <DepartmentNode name="Департамент ИТ" />,
//     },
//     {
//       id: '5',
//       parentId:'1',
//       label: <DepartmentNode name="Сектор АТК" />,
//     },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Оргструктура (пример)
//       </Typography>
//       <Paper sx={{ p: 2 }}>
//         <RichTreeView
//           items={treeItems}
//           defaultExpandedItems={['1']}
//           sx={{ minHeight: 300 }}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default OrgStructure;






// import React from 'react'
// import { Typography, Paper, Box } from '@mui/material'
// import { RichTreeView } from '@mui/x-tree-view'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';
// import orgstructure from './../mock/orgstructure.json'
// import { EmployeeCard } from '../components/EmployeeCard';
// import { CustomTreeItem } from '../components/CustomTreeItem';
// import { OrgSideBar } from '../components/OrgSideBar';
// import avatarurl from './../pictures/gettyimages-87338287-612x612.jpg'


// const OrgStructure = () => {
//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Организационная структура
//       </Typography>
//       <Paper sx={{ p: 3 }}>
//         {/* <EmployeeCard avatarUrl={avatarurl} position='диспетчет департамента' fullName='петр петрович петров'></EmployeeCard> */}
//         {/* <OrgSideBar avatarUrl={avatarurl} fullName='Андрей Попов' position='оператор' department='ааааа' phone='123' workPhone='333' email='rrr'></OrgSideBar> */}
//         {/* <ProfileCardExample/> */}
//         {/* <RichTreeView
//   items={orgstructure}
//   getItemLabel={(item) => item.label || item.fullName}
//   renderItem={(params) => <CustomTreeItem {...params} />}
//   defaultExpandIcon={<ChevronRightIcon />}
//   defaultCollapseIcon={<ExpandMoreIcon />}
// /> */}
//          <RichTreeView
//         items={orgstructure}
//         getItemLabel={(item) => (`${item.fullName} - ${item.position}`)}
//         slots={{
//           item: CustomTreeItem, // 👈 Полная замена узла
//         }}
//   //       slotsProps={{
//   //   item: (item) => ({ itemData: item }), // 👈 передаём весь объект
//   // }}
//         defaultExpandIcon={<ChevronRightIcon />}
//         defaultCollapseIcon={<ExpandMoreIcon />}
//       />
//       </Paper>
//     </Box>
//   );
// };

// export default OrgStructure

// import React from 'react';
// import { Typography, Paper, Box, Button } from '@mui/material';
// import { RichTreeView } from '@mui/x-tree-view';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import orgstructure from './../mock/orgstructure.json';
// import { CustomTreeItem } from './../components/CustomTreeItem';
// import avatarurl from './../pictures/gettyimages-87338287-612x612.jpg'
// import { OrgSideBar } from '../components/OrgSideBar';
// import { useState } from 'react';
// const OrgStructure = () => {
//   const [sidebarData, setSidebarData] = useState(null);
//  const [openSideBar,setOpenSideBar]=useState(false)
//   const handleOpenSidebar = (data) => {
//     setSidebarData(data);
//   };
//   const checkbutton=()=>{
//     console.log(openSideBar)
//     setOpenSideBar(!openSideBar)
//   }
//   const handleCloseSidebar = () => {
//     setSidebarData(null);
//   };
//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Организационная структура
//       </Typography>
//     <Button onClick={checkbutton}>проверка</Button>
//       <Paper sx={{ p: 3 }}>
//         {/* <OrgSideBar avatarUrl={avatarurl} fullName='Андрей Попов' position='оператор' department='ааааа' phone='123' workPhone='333' email='rrr'></OrgSideBar> */}
//         <RichTreeView
//           items={orgstructure}
//           getItemLabel={(item) => item.label}
//           slots={{
//             item: CustomTreeItem, // наша обертка
//           }}
//           defaultExpandIcon={<ChevronRightIcon />}
//           defaultCollapseIcon={<ExpandMoreIcon />}
//         />
//       </Paper>
      
//     </Box>
//   );
// };

// export default OrgStructure;
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