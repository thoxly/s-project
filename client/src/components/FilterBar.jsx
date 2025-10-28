// components/FilterBar.jsx
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const documentTypes = [
  { value: 'all', label: 'Все типы' },
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Видео' },
  { value: 'link', label: 'Ссылка' },
  { value: 'wiki', label: 'Wiki' },
];

const FilterBar = ({ value, onChange }) => (
  <FormControl sx={{ minWidth: 160, padding:'0 0 0 24px'}}>
    <Select value={value} onChange={(e) => onChange(e.target.value)} size="small">
      {documentTypes.map((d) => (
        <MenuItem key={d.value} value={d.value}>
          {d.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default FilterBar;