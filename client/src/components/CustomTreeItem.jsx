// import React from "react";
// import { TreeItem } from "@mui/x-tree-view/TreeItem";
// import { Box } from "@mui/material";
// import { EmployeeCard } from "../components/EmployeeCard";

// export const CustomTreeItem = (props) => {
//   const { itemId, label, expansionIcon, indentationAtItemLevel, itemData,position, ...other } = props;
//   console.log(label)
//   const data = itemData || {}; // 👈 теперь гарантированно есть весь объект
//   console.log(typeof(label))
//   return (
//     <TreeItem
//       {...other}
//       itemId={itemId}
//       label={
//         <Box display="flex" alignItems="center" gap={1}>
//           {expansionIcon && <span>{expansionIcon}</span>}
//           <EmployeeCard
//             fullName={data.fullName || label || "Без имени"}
//             position={data.position || ""}
//             avatarText={data.avatarText || "?"}
//             avatarUrl={data.avatarUrl || null}
//           />
//         </Box>
//       }
//     />
//   );
// };
import React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Box } from '@mui/material';
import { EmployeeCard } from '../components/EmployeeCard';

export const CustomTreeItem = (props) => {
  const { itemId, label, expansionIcon, ...other } = props;

  // label приходит строкой, но мы можем сериализовать туда JSON
  // поэтому парсим, если это возможно
  let data_label = {};
  try {
    data_label = JSON.parse(label);
  } catch {
    data_label = { label };
  }
  return (
    <TreeItem
      {...other}
      itemId={itemId}
      label={
        <Box display="flex" alignItems="center" gap={1}>
          {expansionIcon && <span>{expansionIcon}</span>}
          <EmployeeCard
          data={data_label}
          department ={data_label.type==='department' ? true:false}
            fullName={data_label.type==='department' ? data_label.label : data_label.fullName}
            position={data_label.type==='department' ? '' : data_label.position}
            avatarText={data_label.avatarText || '?'}
            avatarUrl={data_label.avatarUrl || null}
            phone={data_label.phone}
            work_phone={data_label.work_phone}
            email={data_label.email}
          />
        </Box>
      }
    />
  );
};
