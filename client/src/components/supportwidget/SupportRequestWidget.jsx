// src/widgets/SupportRequestsWidget.jsx
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
  Divider,
  Modal,
  TextField,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SupportRequestCard } from './SupportRequestCard';
import {
  HelpOutline as SupportIcon,
  SupportAgent as SupportAgentIcon,
  Build as BuildIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

// --- Вспомогательная функция для генерации UUID ---
function generateSimpleUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- Данные о сервисах ---
const servicesData = {
  id: 'it-support',
  title: 'Заявка в техподдержку',
  icon: 'MonitorCog',
  services: [
    // Перемещаем "admin" в начало списка
    {
      id: 'admin',
      title: 'Администрирование ИС/ОС | Права доступа',
      desc: 'Назначение прав',
    },
    {
      id: 'vcs',
      title: 'Организация ВКС и очных совещаний',
      desc: 'Онлайн/очная встреча',
    },
    {
      id: 'consumables',
      title: 'Замена расходных материалов',
      desc: 'Тонер, чернила, бумага',
    },
    {
      id: 'software',
      title: 'Консультация/неисправность ПО/ИС/ОС',
      desc: 'Диагностика и помощь',
    },
    {
      id: 'printer',
      title: 'Подключение МФУ, принтера, сканера',
      desc: 'Настройка оборудования',
    },
    {
      id: 'hardware',
      title: 'Аппаратная неисправность орг.техники',
      desc: 'Ремонт или замена',
    },
    {
      id: 'storage',
      title: 'Сетевые папки/облачное хранилище',
      desc: 'Настройка доступа',
    },
    {
      id: 'install',
      title: 'Установка ПО/Подключение ИС',
      desc: 'Установка и настройка',
    },
    {
      id: 'network',
      title: 'Неполадки в сети',
      desc: 'Подключение, разрывы',
    },
    {
      id: 'workplace',
      title: 'Подключение / перемещение рабочего места',
      desc: 'Переезд или настройка',
    },
    {
      id: 'signature',
      title: 'Электронная подпись',
      desc: 'Выпуск или замена',
    },
    {
      id: 'secure-net',
      title: 'Доступ в защищенную сеть (VipNet)/СКЗИ и СЗИ (Kaspersky, SecretNet)',
      desc: 'Настройка доступа',
    },
    {
      id: 'other',
      title: 'Другое',
      desc: 'Иные вопросы',
    },
  ],
};

// --- Пример defaultRequestContext ---
// ВАЖНО: Замените этот объект на ваш реальный шаблон заявки
const defaultRequestContext = {
  context: {
    application_type: [
      {
        code: 'zno',
        name: 'ЗНО',
      },
    ],
    priority: [
      {
        code: 'middle',
        name: 'Средний',
      },
    ],
    criticality: [
      {
        code: 'middle',
        name: 'Средняя',
      },
    ],
    urgency: [
      {
        code: 'medium',
        name: 'Средняя',
      },
    ],
    topic: 'Критический сбой в 1С:Бухгалтерия, ошибка прав доступа. Срыв сроков отчетности.',
    contact_information: [
      {
        login: 'example',
        type: 'telegram',
      },
    ],
    responsible: [
      '25f18c44-3d05-4b92-8dbf-b69b4a721b53',
    ],
    service: [
      '019a2fab-8b5e-76ad-b2e3-86347f749a67',
    ],
    client_type: false,
    working_mail: [
      {
        type: 'work',
        email: 'mail@example.com',
      },
    ],
    table_of_sla_indicators: {
      rows: [
        {
          __id: '019a2fba-b10b-7078-a983-ab7f362e4989',
          __count: null,
          sla_level: [
            '019a2fac-abcd-70b8-9c8f-40cfedc70ea0',
          ],
          reaction_time_string: '2 часа',
          solution_time_string: '2 часа',
          reaction_time_seconds: 40.253,
          solution_time_seconds: null,
          reaction_time_string_fact: '40 секунд',
          solution_time_string_fact: '0 минут',
        },
      ],
      view: '',
      result: null,
    },
    sla_level: [
      '019a2fac-abcd-70b8-9c8f-40cfedc70ea0',
    ],
    id_portal: '', // Будет генерироваться при отправке
    aplicant: [
      '019a2f92-8bf9-737b-96e8-b218caca58c6',
    ],
    application_text: '', // Будет подставляться из модального окна
    contact_information: [
      {
        type: 'other',
        login: 'kds+333@axonteam.ru',
      },
    ],
  },
};

const SupportRequestsWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --- Состояния для выпадающего меню ---
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // --- Состояния для модального окна создания заявки ---
  const [openCreate, setOpenCreate] = useState(false);
  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- Обработчики меню ---
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- Обработчики модального окна ---
  const handleOpenCreate = () => {
    setOpenCreate(true);
    handleMenuClose(); // Закрываем меню при открытии модалки
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setDescription(''); // Сбрасываем описание при закрытии
  };

  // --- Обработчик клика по пункту меню (сервису) ---
  const handleServiceItemClick = (serviceId) => {
    console.log(`Выбран сервис: ${serviceId}`);
    if (serviceId === 'admin') {
      handleOpenCreate(); // Открываем модальное окно для "admin"
    } else {
      // Для других сервисов показываем уведомление или заглушку
      const serviceName = servicesData.services.find((s) => s.id === serviceId)?.title || serviceId;
      alert(
        `Вы выбрали: ${serviceName}\n(Недоступно в демо-версии)`
      );
      handleMenuClose(); // Закрываем меню
    }
  };

  // --- Обработчик кнопки "Прикрепить" в модальном окне ---
  const handleSubmit = () => {
    alert('Недоступно в демо-версии');
    handleCloseCreate();
  };

  // --- Обработчик кнопки "Отправить" в модальном окне ---
  const handleSend = async () => {
    if (!description.trim()) {
      alert('Пожалуйста, введите описание.');
      return;
    }

    setIsSending(true);

    try {
      // Генерируем уникальный ID для этой заявки
      const requestId = generateSimpleUUID();

      // Создаём копию объекта и подставляем текущее описание и ID
      const requestToSend = {
        ...defaultRequestContext,
        context: {
          ...defaultRequestContext.context,
          application_text: description, // подставляем текст из поля "Описание"
          id_portal: requestId, // подставляем уникальный ID
        },
      };

      console.log('📤 Отправка заявки на сервер:', requestToSend);

      // Сначала сохраняем в MongoDB через API
      const apiBaseUrl = 'https://sb24xv-194-0-112-167.ru.tuna.am';
      
      console.log('💾 Сохранение заявки в БД:', {
        url: `${apiBaseUrl}/api/requests/support`,
        data: {
          ...requestToSend,
          sentAt: new Date().toISOString(),
          currentStatus: 'Новая',
        }
      });
      
      const saveToDbResponse = await fetch(`${apiBaseUrl}/api/requests/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestToSend,
          sentAt: new Date().toISOString(),
          currentStatus: 'Новая',
        }),
      });

      if (!saveToDbResponse.ok) {
        let errorData;
        try {
          errorData = await saveToDbResponse.json();
        } catch (e) {
          errorData = { error: await saveToDbResponse.text() };
        }
        
        console.error('❌ Ошибка сохранения в БД:', {
          status: saveToDbResponse.status,
          statusText: saveToDbResponse.statusText,
          error: errorData
        });
        
        // Если MongoDB не подключена, показываем пользователю предупреждение
        if (saveToDbResponse.status === 503) {
          alert(`⚠️ Внимание: Заявка не сохранена в базе данных.\nПричина: ${errorData.error || 'MongoDB не подключена'}\n\nЗаявка будет отправлена в ELMA, но не будет сохранена локально.`);
        } else {
          // Для других ошибок также показываем предупреждение
          alert(`⚠️ Внимание: Заявка не сохранена в базе данных.\nСтатус: ${saveToDbResponse.status}\nОшибка: ${errorData.error || 'Неизвестная ошибка'}`);
        }
      } else {
        const dbResult = await saveToDbResponse.json();
        console.log('✅ Заявка сохранена в MongoDB:', dbResult);
      }

      // Отправляем в ELMA
      const elmaResponse = await fetch(`${apiBaseUrl}/api/elma/post_application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestToSend),
      });

      if (!elmaResponse.ok) {
        const errorText = await elmaResponse.text();
        throw new Error(
          `Ошибка сервера ELMA: ${elmaResponse.status} ${elmaResponse.statusText}. ${errorText}`
        );
      }

      const elmaResult = await elmaResponse.json();
      console.log('✅ Заявка успешно отправлена в ELMA:', elmaResult);

      // Обновляем список заявок из API
      await loadRequestsFromAPI();

      // Закрываем модальное окно и сбрасываем состояние
      handleCloseCreate();
    } catch (error) {
      console.error('❌ Ошибка при обработке заявки:', error);
      alert('Не удалось обработать заявку: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  // --- Функция для загрузки заявок из API ---
  const loadRequestsFromAPI = async () => {
    try {
      const apiBaseUrl = 'https://sb24xv-194-0-112-167.ru.tuna.am';
      const response = await fetch(`${apiBaseUrl}/api/requests/support`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ Ошибка при загрузке заявок: ${response.status} ${response.statusText}`);
        // Fallback на localStorage если API недоступен
        return loadRequestsFromLocalStorage();
      }

      const result = await response.json();
      console.log('📥 Заявки загружены из API:', result);

      if (result.success && Array.isArray(result.data)) {
        const formattedRequests = result.data.map((storageItem) => {
          const context = storageItem.context || {};
          const appId = context.id_portal || generateSimpleUUID();
          const initialStatus = storageItem.currentStatus || 'Новая';

          return {
            id: appId,
            ticketNumber: 'SD-' + appId.split('-')[0].substring(0, 6).toUpperCase(),
            createdAt: storageItem.sentAt || storageItem.createdAt || new Date().toISOString(),
            initiator: 'Демо-пользователь',
            type: 'Администрирование ИС/ОС | Права доступа',
            description: context.application_text || 'Описание отсутствует',
            status: initialStatus,
            assignee: '—',
          };
        });

        setRequests(formattedRequests);
        console.log(`📦 Установлено ${formattedRequests.length} заявок из API.`);
        return formattedRequests;
      } else {
        // Fallback на localStorage
        return loadRequestsFromLocalStorage();
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке заявок из API:', error);
      // Fallback на localStorage
      return loadRequestsFromLocalStorage();
    }
  };

  // --- Функция для загрузки заявок из localStorage (fallback) ---
  const loadRequestsFromLocalStorage = () => {
    try {
      console.log('📂 Загрузка существующих заявок из localStorage (fallback)...');
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

      const formattedRequests = storedRequests.map((storageItem) => {
        const context = storageItem.context || {};
        const appId = context.id_portal || generateSimpleUUID();
        const initialStatus = storageItem.currentStatus || 'Новая';

        return {
          id: appId,
          ticketNumber: 'SD-' + appId.split('-')[0].substring(0, 6).toUpperCase(),
          createdAt: storageItem.sentAt || new Date().toISOString(),
          initiator: 'Демо-пользователь',
          type: 'Администрирование ИС/ОС | Права доступа',
          description: context.application_text || 'Описание отсутствует',
          status: initialStatus,
          assignee: '—',
        };
      });

      setRequests(formattedRequests);
      console.log(`📦 Установлено ${formattedRequests.length} заявок из localStorage.`);
      return formattedRequests;
    } catch (error) {
      console.error('💥 Неожиданная ошибка при загрузке заявок из localStorage:', error);
      setRequests([]);
      return [];
    }
  };

  // --- Функция для проверки обновлений статуса из ELMA ---
  const fetchStatusUpdates = async () => {
    try {
      console.log('🔁 Запрос обновлений статуса у сервера...');
      const apiBaseUrl = 'https://sb24xv-194-0-112-167.ru.tuna.am';
      const response = await fetch(`${apiBaseUrl}/api/elma/check_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ Ошибка при запросе статуса: ${response.status} ${response.statusText}`);
        return;
      }

      const statusUpdatesArray = await response.json();
      console.log('📥 Получены обновления статуса от сервера:', statusUpdatesArray);

      if (Array.isArray(statusUpdatesArray) && statusUpdatesArray.length > 0) {
        // Обновляем статусы в MongoDB через API
        for (const update of statusUpdatesArray) {
          const { id: serverId, status: newStatus } = update;

          if (serverId && newStatus !== undefined) {
            try {
              const apiBaseUrl = 'https://sb24xv-194-0-112-167.ru.tuna.am';
              await fetch(`${apiBaseUrl}/api/requests/support/${serverId}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentStatus: newStatus }),
              });
              console.log(`🔄 Статус заявки ${serverId} обновлен в БД: ${newStatus}`);
            } catch (error) {
              console.error(`❌ Ошибка при обновлении статуса в БД для ${serverId}:`, error);
            }
          }
        }

        // Перезагружаем заявки из API
        await loadRequestsFromAPI();
      } else {
        console.log(
          'ℹ️ Сервер вернул пустой массив или не массив. Нет обновлений статуса.'
        );
      }
    } catch (error) {
      console.error('❌ Ошибка при получении/обработке обновлений статуса через поллинг:', error);
    }
  };

  // --- Эффект для загрузки заявок из API и поллинга ---
  useEffect(() => {
    let loadTimerId;
    let pollIntervalId;

    loadTimerId = setTimeout(async () => {
      await loadRequestsFromAPI();
      setLoading(false);
      console.log('🏁 Первоначальная загрузка завершена.');

      console.log('📡 Запуск поллинга статуса (/api/elma/check_status) каждые 10 секунд...');
      fetchStatusUpdates();
      pollIntervalId = setInterval(() => {
        console.log('🔁 Выполнение периодического запроса статуса...');
        fetchStatusUpdates();
      }, 10000); // Каждые 10 секунд
    }, 500); // Небольшая задержка для имитации загрузки

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
  }, []); // Пустой массив зависимостей - эффект выполняется только при монтировании

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={isMobile ? '80px' : '100px'}
      >
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
              onClick={handleMenuClick} // Открывает меню
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

            {/* --- Выпадающее меню со списком всех сервисов --- */}
             <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              // --- Исправленные свойства позиционирования ---
              anchorOrigin={{
                vertical: 'top',    // Верх кнопки
                horizontal: 'right', // Правый край кнопки
              }}
              transformOrigin={{
                vertical: 'top',    // Верх меню
                horizontal: 'left', // Левый край меню
              }}
              // ---------------------------------------------
              PaperProps={{
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  mt: 0.5, // Небольшой отступ сверху, чтобы не прилипало вплотную
                  mr: 0.5, // Небольшой отступ справа, если нужно
                },
              }}
            >
              {/* Заголовок меню */}
              <MenuItem disabled>
                <ListItemText
                  primary={servicesData.title}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </MenuItem>
              <Divider />

              {/* Динамически создаем пункты меню из servicesData.services */}
              {servicesData.services.map((service) => (
                <MenuItem
                  key={service.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceItemClick(service.id);
                  }}
                  sx={{ py: 1 }}
                >
                  <ListItemIcon>
                    {service.id === 'admin' ? (
                      <SupportAgentIcon fontSize="small" color="primary" />
                    ) : (
                      <BuildIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={service.title}
                    secondary={service.desc}
                    primaryTypographyProps={{
                      fontWeight: service.id === 'admin' ? 600 : 500,
                    }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>
      )}

      {/* --- Модальное окно для создания заявки "admin" --- */}
      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 }, // Адаптивная ширина
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: '90vh',
            overflowY: 'auto', // Скролл внутри модального окна
          }}
        >
          <Typography sx={{ padding: '0 0 8px 0' }} variant="h6" fontWeight={600} gutterBottom>
            Администрирование ИС/ОС | Права доступа
          </Typography>
          <TextField
            label="Описание"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Tooltip title="Недоступно в демо-версии" arrow>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={handleSubmit}
                sx={{
                  color: 'text.primary',
                  borderColor: 'grey.400',
                  '&:hover': {
                    backgroundColor: 'grey.50',
                    borderColor: 'grey.500',
                  },
                }}
              >
                Прикрепить
              </Button>
            </Tooltip>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                width: '100%',
                mt: 1, // Отступ сверху
              }}
            >
              <Button onClick={handleCloseCreate} disabled={isSending}>
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={isSending || !description.trim()} // Отключаем, если пусто или отправляется
                sx={{
                  color: 'white',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isSending ? 'Отправка...' : 'Отправить'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Список заявок или сообщение "пусто" */}
      {requests.length > 0 ? (
        <Box>
          {requests.map((request) => (
            <SupportRequestCard
              key={request.id}
              request={request}
              onClick={() => {
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