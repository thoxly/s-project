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
// Добавьте в список импортов из '@mui/material'
import {  CheckCircle as CheckCircleIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
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
    __name:'',
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
    "current_support_level": [
        "019a2f5f-9117-770d-ba20-73d528ca2155"
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

    const [sendResult, setSendResult] = useState(null); // 'success' | 'error' | null
  const [sendMessage, setSendMessage] = useState(''); // Текст сообщения
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
    setDescription('');
    setIsSending(false);
    setSendResult(null); // Сброс результата
    setSendMessage('');  // Сброс сообщения
  };
 const handleOkAfterSuccess = () => {
    handleCloseCreate(); // Закрываем и сбрасываем всё
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
    // Вместо alert, покажем сообщение в модалке
    setSendResult('error');
    setSendMessage('Пожалуйста, введите описание.');
    return;
  }

  setIsSending(true);
  setSendResult(null); // Сброс результата перед новой отправкой
  setSendMessage('');  // Сброс сообщения

  try {
    // --- 1. Генерируем уникальный ID для этой заявки ---
    const requestId = generateSimpleUUID();

    // --- 2. Формируем название заявки вида SD-XXXXXX ---
    const ticketNumber = 'SD-' + requestId.split('-')[0].substring(0, 6).toUpperCase();

    // --- 3. Создаём копию объекта и подставляем текущее описание, ID и __name ---
    const requestToSend = {
      ...defaultRequestContext,
      context: {
        ...defaultRequestContext.context,
        __name: ticketNumber,        // ← Подставляем сформированное имя
        application_text: description, // подставляем текст из поля "Описание"
        id_portal: requestId,         // подставляем уникальный ID
      },
    };

    console.log('📤 Отправка заявки на сервер:', requestToSend);

    // --- 4. Отправляем на сервер ---
    const serverResponse = await fetch('/api/elma/post_application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestToSend),
    });

    if (!serverResponse.ok) {
      const errorText = await serverResponse.text();
      throw new Error(
        `Ошибка сервера: ${serverResponse.status} ${serverResponse.statusText}. ${errorText}`
      );
    }

    const serverResult = await serverResponse.json();
    console.log('✅ Заявка успешно отправлена на сервер:', serverResult);

    // --- 5. Сохраняем в localStorage ---
    const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    existingApplications.push({
      ...requestToSend,
      sentAt: new Date().toISOString(), // Добавляем временную метку
    });
    localStorage.setItem('applications', JSON.stringify(existingApplications));

    console.log('💾 Заявка сохранена в localStorage');

    // --- 6. Показываем успех ---
    setSendResult('success');
    setSendMessage(`Заявка ${ticketNumber} успешно отправлена!`);

  } catch (error) {
    console.error('❌ Ошибка при обработке заявки:', error);
    // --- Показываем ошибку ---
    setSendResult('error');
    setSendMessage('Произошла ошибка при отправке заявки.');
  } finally {
    setIsSending(false);
  }
};

  // --- Эффект для загрузки заявок из localStorage и поллинга ---
  useEffect(() => {
    let loadTimerId;
    let pollIntervalId;

    const fetchStatusUpdates = async () => {
      try {
        console.log('🔁 Запрос обновлений статуса у сервера...');
        // Используем правильный URL, возможно, с proxy
        const response = await fetch('https://api-surius.ru.tuna.am/api/elma/check_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ action: 'getStatusUpdates' }), // Опционально
        });

        if (!response.ok) {
          console.warn(`Ошибка при запросе статуса: ${response.status} ${response.statusText}`);
          return;
        }

        const statusUpdatesArray = await response.json();
        console.log('📥 Получены обновления статуса от сервера:', statusUpdatesArray);

        if (Array.isArray(statusUpdatesArray) && statusUpdatesArray.length > 0) {
          setRequests((prevRequests) => {
            let hasChanges = false;
            const updatedRequests = [...prevRequests];
            let storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
            let localStorageUpdated = false;

            statusUpdatesArray.forEach((update) => {
              const { id: serverId, status: newStatus } = update;

              if (serverId && newStatus !== undefined) {
                const indexToUpdate = updatedRequests.findIndex((req) => req.id === serverId);

                if (
                  indexToUpdate !== -1 &&
                  updatedRequests[indexToUpdate].status !== newStatus
                ) {
                  console.log(
                    `🔄 Обновление статуса для заявки ${serverId}: ${updatedRequests[indexToUpdate].status} -> ${newStatus}`
                  );
                  updatedRequests[indexToUpdate] = {
                    ...updatedRequests[indexToUpdate],
                    status: newStatus,
                  };
                  hasChanges = true;

                  const storageIndexToUpdate = storedApplications.findIndex(
                    (item) => item.context?.id_portal === serverId
                  );
                  if (storageIndexToUpdate !== -1) {
                    storedApplications[storageIndexToUpdate].currentStatus = newStatus;
                    localStorageUpdated = true;
                  }
                }
              }
            });

            if (hasChanges) {
              if (localStorageUpdated) {
                try {
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
          console.log(
            'ℹ️ Сервер вернул пустой массив или не массив. Нет обновлений статуса.'
          );
        }
      } catch (error) {
        console.error('❌ Ошибка при получении/обработке обновлений статуса через поллинг:', error);
      }
    };

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

        const formattedRequests = storedRequests.map((storageItem) => {
          const context = storageItem.context || {};
          const appId = context.id_portal || generateSimpleUUID();
          const initialStatus = storageItem.currentStatus || 'Новая';

          return {
            id: appId,
            ticketNumber: 'SD-' + appId.split('-')[0].substring(0, 6).toUpperCase(),
            createdAt: storageItem.sentAt || new Date().toISOString(),
            type: 'Администрирование ИС/ОС | Права доступа',
            description: context.application_text || 'Описание отсутствует',
            status: initialStatus,
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

      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box
          sx={{
            // --- Стили позиционирования и размера ---
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 }, // Адаптивная ширина
            // --- Стили оформления ---
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: '90vh',
            overflowY: 'auto', // Скролл внутри модального окна
          }}
        >
          {/* --- Условный рендеринг: сообщение или форма --- */}
          {sendResult === 'success' || sendResult === 'error' ? (
            // --- Отображение результата отправки ---
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {sendResult === 'success' ? (
                <Box sx={{ color: 'success.main', mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Успешно!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ color: 'error.main', mb: 2 }}>
                  <ErrorOutlineIcon sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ошибка
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ mb: 3 }}>
                {sendMessage}
              </Typography>
              <Button
                variant="contained"
                onClick={sendResult === 'success' ? handleOkAfterSuccess : handleCloseCreate}
                sx={{
                  color: 'white',
                  backgroundColor: sendResult === 'success' ? 'success.main' : 'error.main',
                  '&:hover': {
                    backgroundColor: sendResult === 'success' ? 'success.dark' : 'error.dark',
                  },
                }}
              >
                OK
              </Button>
            </Box>
          ) : isSending ? (
            // --- Отображение спиннера во время отправки ---
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1">Отправка заявки...</Typography>
            </Box>
          ) : (
            // --- Отображение формы ввода ---
            <>
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
                    mt: 1,
                  }}
                >
                  <Button onClick={handleCloseCreate} disabled={isSending}>
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={isSending || !description.trim()}
                    sx={{
                      color: 'white',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Отправить
                  </Button>
                </Box>
              </Box>
            </>
          )}
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