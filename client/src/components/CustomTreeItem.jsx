import React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Box } from '@mui/material';
import { EmployeeCard } from '../components/EmployeeCard';

export const CustomTreeItem = (props) => {
  const { itemId, label, expansionIcon, onDepartmentClick, ...other } = props;

  // label приходит строкой, но мы можем сериализовать туда JSON
  // поэтому парсим, если это возможно
  let data_label = {};
  try {
    data_label = JSON.parse(label);
  } catch {
    data_label = { label };
  }
  
  // Добавляем ID отдела в данные
  const departmentData = {
    ...data_label,
    id: itemId
  };
  
  return (
    <TreeItem
      {...other}
      itemId={itemId}
      label={
        <Box display="flex" alignItems="center" gap={1}>
          {expansionIcon && <span>{expansionIcon}</span>}
          <EmployeeCard
            data={departmentData}
            department={true}
            fullName={data_label.label}
            position=""
            avatarText="?"
            avatarUrl={null}
            phone=""
            work_phone=""
            email=""
            onDepartmentClick={onDepartmentClick}
          />
        </Box>
      }
    />
  );
};
