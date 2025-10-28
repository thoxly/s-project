import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import KnowledgeTabs from '../components/KnowledgeTabs';
import KnowledgeGrid from '../components/Knowledgegrid';
import { KnowledgeModal } from '../components/KnowledgeModal';

const KnowledgeBase = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState({ administrative: [], technical: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenModal = (item) => setModalData(item);
  const handleCloseModal = () => setModalData(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/api/elma/get_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }

        const result = await response.json();
        console.log('Данные из API:', result);

        // Парсим массив объектов
        const administrative = result.filter(item => 
          item.category && item.category.some(cat => cat.code === 'administrative')
        );

        const technical = result.filter(item => 
          item.category && item.category.some(cat => cat.code === 'technical')
        );

        setData({
          administrative: administrative.map(item => ({
            title: item.__name || 'Без названия',
            description: item.description || 'Описание отсутствует',
            type: item.type?.[0]?.code || 'unknown', // берем первый тип
          })),
          technical: technical.map(item => ({
            title: item.__name || 'Без названия',
            description: item.description || 'Описание отсутствует',
            type: item.type?.[0]?.code || 'unknown',
          })),
        });
      } catch (err) {
        setError(err.message);
        console.error('Ошибка запроса:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Выбираем данные в зависимости от активной вкладки
  const currentData = tab === 0 ? data.administrative : data.technical;

  // Фильтрация: по типу и по поиску
  const filteredData = currentData.filter(
    (item) =>
      (filter === 'all' || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Ошибка загрузки: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '0 32px 0 32px' }}>
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
