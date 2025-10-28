// components/SearchBar.jsx
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ value, onChange }) => (
  <TextField
    placeholder="Поиск..."
    size="small"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{ width: 280}}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;