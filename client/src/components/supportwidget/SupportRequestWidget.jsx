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
    let loadTimerId;
    let pollIntervalId;

    const fetchStatusUpdates = async () => {
      try {
        console.log('🔁 Запрос обновлений статуса у сервера...');
        const response = await fetch('/api/elma/check_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(`Ошибка при запросе статуса: ${response.status} ${response.statusText}`);
          return;
        }

        const statusUpdatesArray = await response.json();
        console.log('📥 Получены обновления статуса от сервера:', statusUpdatesArray);

        if (Array.isArray(statusUpdatesArray) && statusUpdatesArray.length > 0) {
          
          setRequests(prevRequests => {
            let hasChanges = false;
            const updatedRequests = [...prevRequests];
            // Будем также обновлять localStorage
            let storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
            let localStorageUpdated = false;

            statusUpdatesArray.forEach(update => {
              const { id: serverId, status: newStatus } = update;

              if (serverId && newStatus !== undefined) {
                const indexToUpdate = updatedRequests.findIndex(req => req.id === serverId);

                if (indexToUpdate !== -1 && updatedRequests[indexToUpdate].status !== newStatus) {
                  console.log(`🔄 Обновление статуса для заявки ${serverId}: ${updatedRequests[indexToUpdate].status} -> ${newStatus}`);
                  
                  // Обновляем состояние React
                  updatedRequests[indexToUpdate] = {
                    ...updatedRequests[indexToUpdate],
                    status: newStatus,
                  };
                  hasChanges = true;

                  // Обновляем данные в storedApplications (для последующего сохранения в localStorage)
                  const storageIndexToUpdate = storedApplications.findIndex(item => 
                    item.context?.id_portal === serverId
                  );
                  if (storageIndexToUpdate !== -1) {
                    // Здесь можно обновить любые другие поля, если они приходят в update
                    // Пока обновляем только статус в отдельном поле или имитируем
                    // Для примера, добавим поле lastStatusUpdate в сам item, если нужно отслеживать
                    // Но чаще всего сервер присылает полный объект или изменения
                    // Предположим, сервер присылает полный объект заявки или нужно обновить конкретные поля
                    
                    // Если сервер присылает полный объект заявки, заменяем его
                    // Но в вашем случае он присылает только id и status
                    // Можно добавить логику обновления других полей аналогично
                    
                    localStorageUpdated = true; // Флаг, что были изменения в данных для LS
                  }
                }
              }
            });

            // Если были изменения в React, обновляем состояние
            if (hasChanges) {
              // Также обновляем localStorage, если были изменения
              if (localStorageUpdated) {
                try {
                  // Обновляем каждую заявку в storedApplications, если её статус изменился
                  statusUpdatesArray.forEach(update => {
                    const { id: serverId, status: newStatus } = update;
                    const storageIndex = storedApplications.findIndex(item => 
                      item.context?.id_portal === serverId
                    );
                    if (storageIndex !== -1 && storedApplications[storageIndex].lastUpdatedStatus !== newStatus) {
                      // Добавляем или обновляем поле статуса в контексте или отдельно
                      // ВАЖНО: Определимся, как именно хранить статус в localStorage
                      // Вариант 1: Добавить отдельное поле в объект item
                      storedApplications[storageIndex].lastUpdatedStatus = newStatus;
                      // Вариант 2: Обновить статус внутри context (если сервер присылает его так)
                      // Но если сервер присылает только id и status, нужно решить, как хранить
                      
                      // Для простоты, добавим поле lastUpdatedStatus в сам item
                      // Или обновим статус в отдельном объекте статусов, если нужно
                      
                      // ПРЕДПОЛОЖИМ, что мы хотим обновлять "дефолтный" статус в localStorage
                      // Это сложнее, так как в localStorage у нас полный объект заявки
                      // Нужно решить, что делать. 
                      
                      // ЛУЧШЕ: Хранить актуальный статус прямо в состоянии React
                      // и при необходимости (например, перезагрузка страницы) 
                      // оттуда брать. А localStorage использовать как "архив" начальных данных.
                      // 
                      // Но если ТРЕБУЕТСЯ, чтобы изменения сохранялись в localStorage:
                      // 
                      // Мы можем:
                      // 1. Добавить в каждый item в localStorage поле `currentStatus`
                      // 2. Или хранить отдельный объект статусов в localStorage
                      // 
                      // Реализуем вариант 1: добавим `currentStatus` в item localStorage
                      storedApplications[storageIndex].currentStatus = newStatus;
                    }
                  });
                  
                  // Сохраняем обновлённый массив в localStorage
                  localStorage.setItem('applications', JSON.stringify(storedApplications));
                  console.log('💾 Обновленные данные заявок сохранены в localStorage.');
                } catch (e) {
                  console.error('Ошибка при сохранении обновлений в localStorage:', e);
                }
              }
              
              return updatedRequests;
            }
            
            return prevRequests;
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
            storedRequests = [];
          }
        }

        // Преобразуем данные из localStorage в формат, ожидаемый SupportRequestCard
        // УЧИТЫВАЕМ currentStatus из localStorage, если он есть
        const formattedRequests = storedRequests.map(storageItem => {
          const context = storageItem.context || {};
          const appId = context.id_portal || generateSimpleUUID();
          
          // Берем статус из поля currentStatus (если обновлялся), иначе дефолтный
          const initialStatus = storageItem.currentStatus || 'Новая';

          return {
            id: appId,
            ticketNumber: 'SD-' + appId.split('-')[0].substring(0, 6).toUpperCase(),
            createdAt: storageItem.sentAt || new Date().toISOString(),
            initiator: 'Демо-пользователь',
            type: 'Администрирование ИС/ОС | Права доступа',
            description: context.application_text || 'Описание отсутствует',
            status: initialStatus, // <- Используем сохранённый или дефолтный статус
            assignee: '—',
          };
        });

        setRequests(formattedRequests);
        console.log(`📦 Установлено ${formattedRequests.length} заявок в состояние компонента.`);
      } catch (error) {
        console.error('💥 Неожиданная ошибка при загрузке заявок из localStorage:', error);
        setRequests([]);
      } finally {
        setLoading(false);
        console.log('🏁 Первоначальная загрузка завершена.');
      }

      // --- 2. Запуск периодического поллинга ---
      console.log('📡 Запуск поллинга статуса (/api/elma/check_status) каждые 10 секунд...');
      fetchStatusUpdates();
      pollIntervalId = setInterval(() => {
        console.log('🔁 Выполнение периодического запроса статуса...');
        fetchStatusUpdates();
      }, 10000);

    }, 500);

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