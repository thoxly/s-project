// components/KnowledgeGrid.jsx
import React from 'react';
import { Grid } from '@mui/material';
import KnowledgeCard from './KnowledgeCard';

const KnowledgeGrid = ({ data, onOpen }) => (
  <Grid container spacing={2.5}>
    {data.map((item, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || index}>
        <KnowledgeCard
          title={item.title}
          description={item.description}
          type={item.type}
          onOpen={onOpen}
        />
      </Grid>
    ))}
  </Grid>
);

export default KnowledgeGrid;