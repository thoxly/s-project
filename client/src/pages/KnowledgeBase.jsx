import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import KnowledgeTabs from '../components/KnowledgeTabs';
import KnowledgeGrid from '../components/Knowledgegrid';
import { KnowledgeModal } from '../components/KnowledgeModal';

// Импортируем mock-данные
import administrativeData from '../mock/administrativedata.json';
import technicalData from '../mock/technicaldata.json';

const KnowledgeBase = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalData, setModalData] = useState(null);

  const handleOpenModal = (data) => setModalData(data);
  const handleCloseModal = () => setModalData(null);

  // Выбираем данные в зависимости от активной вкладки
  const currentData = tab === 0 ? administrativeData : technicalData;

  // Фильтрация: по типу и по поиску
  const filteredData = currentData.filter(
    (item) =>
      (filter === 'all' || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: '0 32px 0 32px'}}>
      <Typography variant="h4" gutterBottom>
        База знаний
      </Typography>

      {/* === Верхняя панель: SearchBar, FilterBar и Tabs в одной строке === */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar value={filter} onChange={setFilter} />
        <Box sx={{ ml: 'auto' }}> {/* Tabs справа */}
          <KnowledgeTabs value={tab} onChange={setTab} />
        </Box>
      </Box>

      <KnowledgeGrid data={filteredData} onOpen={handleOpenModal} />

      <KnowledgeModal
        open={!!modalData}
        onClose={handleCloseModal}
        data={modalData}
      />
    </Box>
  );
};

export default KnowledgeBase;
