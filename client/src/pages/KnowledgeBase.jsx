import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Container, Fade } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import KnowledgeTabs from '../components/knowledgebase/KnowledgeTabs';
import KnowledgeGrid from '../components/knowledgebase/KnowledgeGrid';
import { KnowledgeModal } from '../components/knowledgebase/KnowledgeModal';

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
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Заголовок страницы */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(30, 60, 147, 0.1) 0%, rgba(30, 60, 147, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, rgb(30, 60, 147) 0%, rgb(45, 85, 180) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  База знаний
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Корпоративные документы и инструкции
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

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
      </Container>
    </Box>
  );
};

export default KnowledgeBase;
