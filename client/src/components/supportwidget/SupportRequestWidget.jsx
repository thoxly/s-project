import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SupportRequestCard } from './SupportRequestCard'; // Убедитесь, что путь правильный
import { HelpOutline as SupportIcon, SupportAgent as SupportAgentIcon } from '@mui/icons-material';

// --- Вспомогательная функция для генерации UUID (если uuid не используется) ---
// Если вы используете библиотеку uuid, эту функцию можно удалить
function generateSimpleUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const SupportRequestsWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  let status_elems=[]
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    navigate('/services');
    handleClose();
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/elma/check_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Если сервер требует тело запроса, добавьте его здесь
        // body: JSON.stringify({ /* данные, если нужны */ }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statusData = await response.json();
      console.log('Получен статус от сервера:', statusData);
      status_elems=statusData
      // --- Здесь обрабатывайте полученные данные ---
      // Например, обновите другое состояние, если statusData что-то влияет на UI
      // Для примера просто логируем
      // setSomeStatusState(statusData); 

    } catch (error) {
      console.error('Ошибка при получении статуса:', error);
      // Опционально: показать уведомление пользователю
    }
  };
  
  // --- Эффект для загрузки заявок из localStorage ---
  useEffect(() => {
    let loadTimerId; // ID таймера загрузки из localStorage
    let pollIntervalId; // ID интервала поллинга

    // --- Функция для получения обновлений статуса с сервера ---
    const fetchStatusUpdates = async () => {
      try {
        console.log('🔁 Запрос обновлений статуса у сервера...');
        // --- 1. Отправляем POST-запрос на серверный эндпоинт ---
        const response = await fetch('/api/elma/check_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Добавьте тело запроса, если оно требуется сервером
          // body: JSON.stringify({ action: 'getStatusUpdates' }),
        });

        if (!response.ok) {
          console.warn(`Ошибка при запросе статуса: ${response.status} ${response.statusText}`);
          return;
        }

        // --- 2. Парсим JSON-ответ от сервера ---
        const statusUpdatesArray = await response.json();
        console.log('📥 Получены обновления статуса от сервера:', statusUpdatesArray);

        // --- 3. Обработка полученных данных и обновление состояния ---
        // Проверяем, что ответ - это массив
        if (Array.isArray(statusUpdatesArray) && statusUpdatesArray.length > 0) {
          
          // Обновляем состояние `requests`, используя функциональный способ обновления
          setRequests(prevRequests => {
            // Флаг, чтобы отследить, были ли фактические изменения
            let hasChanges = false;

            // Создаем копию предыдущего состояния, которую будем мутировать
            const updatedRequests = [...prevRequests];

            // Проходим по каждому обновлению статуса от сервера
            statusUpdatesArray.forEach(update => {
              // Предполагаем, что сервер присылает объект с полями { id: '...', status: '...' }
              // где `id` - это ID, который соответствует `id_portal` в localStorage/context
              const { id: serverId, status: newStatus } = update;

              if (serverId && newStatus !== undefined) {
                // Находим индекс заявки в нашем текущем массиве по serverId (который = id_portal)
                const indexToUpdate = updatedRequests.findIndex(req => req.id === serverId);

                // Если заявка найдена и её статус изменился
                if (indexToUpdate !== -1 && updatedRequests[indexToUpdate].status !== newStatus) {
                  console.log(`🔄 Обновление статуса для заявки ${serverId}: ${updatedRequests[indexToUpdate].status} -> ${newStatus}`);
                  
                  // Создаем новый объект заявки с обновленным статусом
                  updatedRequests[indexToUpdate] = {
                    ...updatedRequests[indexToUpdate],
                    status: newStatus,
                  };
                  hasChanges = true; // Отмечаем, что были изменения
                }
              }
            });

            // Если были изменения, возвращаем новый массив (провоцирует ререндер)
            // Если нет, возвращаем предыдущий массив (React не перерендерит)
            return hasChanges ? updatedRequests : prevRequests;
          });
        } else {
          console.log("ℹ️ Сервер вернул пустой массив или не массив. Нет обновлений статуса.");
        }

      } catch (error) {
        console.error('❌ Ошибка при получении/обработке обновлений статуса через поллинг:', error);
      }
    };

    // --- 1. Начальная загрузка данных из localStorage ---
    loadTimerId = setTimeout(() => {
      try {
        console.log('📂 Загрузка существующих заявок из localStorage...');
        const storedRequestsRaw = localStorage.getItem('applications');
        let storedRequests = [];

        if (storedRequestsRaw) {
          try {
            storedRequests = JSON.parse(storedRequestsRaw);
            console.log(`✅ Успешно загружено ${storedRequests.length} заявок из localStorage.`);
          } catch (parseError) {
            console.error('⚠️ Ошибка парсинга данных из localStorage:', parseError);
            storedRequests = []; // Сбрасываем, если данные повреждены
          }
        }

        // Преобразуем данные из localStorage (массив объектов с полем context) 
        // в формат, ожидаемый SupportRequestCard
        const formattedRequests = storedRequests.map(storageItem => {
          // storageItem - это объект { context: {...}, sentAt: "..." }
          const context = storageItem.context || {};
          const appId = context.id_portal || generateSimpleUUID(); // Используем id_portal как основной ID

          return {
            id: appId, // Ключевое поле для сопоставления!
            ticketNumber: 'SD-' + appId.split('-')[0].substring(0, 6).toUpperCase(), // Пример: SD-A1B2C3
            createdAt: storageItem.sentAt || new Date().toISOString(), // Используем дату отправки из LS
            initiator: 'Демо-пользователь', // Захардкожено, как в требованиях
            type: 'Администрирование ИС/ОС | Права доступа', // Захардкожено
            description: context.application_text || 'Описание отсутствует', // Из текста формы
            status: 'Новая', // Начальный статус для новых заявок из LS
            assignee: '—', // Пока не назначен
            // rawContext: context // Для отладки, если нужно видеть весь контекст
          };
        });

        // Обновляем состояние React
        setRequests(formattedRequests);
        console.log(`📦 Установлено ${formattedRequests.length} заявок в состояние компонента.`);
      } catch (error) {
        console.error('💥 Неожиданная ошибка при загрузке заявок из localStorage:', error);
        setRequests([]); // На случай непредвиденной ошибки
      } finally {
        setLoading(false); // Завершаем индикатор загрузки
        console.log('🏁 Первоначальная загрузка завершена.');
      }

      // --- 2. Запуск периодического поллинга ---
      console.log('📡 Запуск поллинга статуса (/api/elma/check_status) каждые 10 секунд...');
      // Запрашиваем статус сразу после первой загрузки
      fetchStatusUpdates();

      // Устанавливаем интервал для периодических запросов
      pollIntervalId = setInterval(() => {
        console.log('🔁 Выполнение периодического запроса статуса...');
        fetchStatusUpdates();
      }, 10000); // Интервал в миллисекундах (10 секунд)

    }, 500); // Небольшая задержка для имитации загрузки (можно убрать)

    // --- Функция очистки, вызываемая при размонтировании компонента ---
    return () => {
      console.log('🧹 Очистка ресурсов компонента...');
      if (loadTimerId) {
        clearTimeout(loadTimerId);
        console.log('⏱️ Таймер загрузки очищен.');
      }
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        console.log('⏰ Интервал поллинга остановлен.');
      }
    };
  }, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={isMobile ? '80px' : '100px'}>
        <Typography variant={isMobile ? 'body2' : 'body1'}>Загрузка заявок...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Кнопка "+ Заявка" отображается только если список пуст */}
      {requests.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <div>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              onClick={handleClick}
              sx={{
                borderRadius: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 0.75, sm: 1 },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: isMobile ? 'none' : 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(30, 58, 138, 0.2)',
                },
              }}
            >
              + Заявка
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 4,
                sx: { borderRadius: 2 },
              }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuItemClick}>
                <ListItemIcon>
                  <SupportAgentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Заявка в техподдержку" />
              </MenuItem>
            </Menu>
          </div>
        </Box>
      )}

      {/* Список заявок или сообщение "пусто" */}
      {requests.length > 0 ? (
        <Box>
          {requests.map((request) => (
            <SupportRequestCard
              key={request.id} // Используем уникальный ID из заявки
              request={request}
              onClick={() => {
                // В демо — показываем уведомление
                alert('Недоступно в демо-версии');
              }}
            />
          ))}
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'grey.400',
            backgroundColor: 'rgba(245, 245, 245, 0.3)',
            borderRadius: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            У вас пока нет заявок в техподдержку
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SupportRequestsWidget;