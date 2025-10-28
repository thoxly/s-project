// components/KnowledgeTabs.jsx
import React from 'react';
import { Tabs, Tab } from '@mui/material';

const KnowledgeTabs = ({ value, onChange }) => (
  <Tabs value={value} onChange={(_, val) => onChange(val)}>
    <Tab label="Административная часть" />
    <Tab label="Техническая часть" />
  </Tabs>
);

export default KnowledgeTabs;