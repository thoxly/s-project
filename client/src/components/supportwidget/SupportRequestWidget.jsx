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
  Drawer,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SupportRequestCard } from './SupportRequestCard';
import {
  HelpOutline as SupportIcon,
  SupportAgent as SupportAgentIcon,
  Build as BuildIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
// Добавьте в список импортов из '@mui/material'
import {  CheckCircle as CheckCircleIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
// --- Вспомогательная функция для генерации UUID ---
function generateSimpleUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Карта цветов для статусов
const statusColors = {
  'Новая': 'default',
  'В работе': 'info',
  'На уточнении': 'warning',
  'Закрыта': 'success',
  'Отложена': 'secondary',
  'Отменена': 'error',
  'Выполнена': 'success',
};

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

  // --- Состояния для Drawer ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  // --- Состояния для модального окна создания ---
  const [sendResult, setSendResult] = useState(null); // 'success' | 'error' | 'db_warning' | null
  const [sendMessage, setSendMessage] = useState('');
  const [dbWarningMessage, setDbWarningMessage] = useState('');

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
    setDbWarningMessage(''); // Сброс предупреждения
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

  // --- Функция для открытия Drawer и загрузки деталей заявки ---
  const handleRequestClick = async (request) => {
    setSelectedRequest(request);
    setDrawerOpen(true);
    setLoadingDetails(true);
    setRequestDetails(null);

    try {
      // Загружаем детали заявки из API
      const apiBaseUrl = '';
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🔍 ФРОНТЕНД: Загрузка деталей заявки:', request.id);
      console.log('═══════════════════════════════════════════════════════════');
      
      const response = await fetch(`${apiBaseUrl}/api/requests/support/${request.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        console.log('📥 ФРОНТЕНД: Детали заявки получены:', {
          success: result.success,
          has_data: !!result.data,
          id_portal: result.data?.context?.id_portal,
          status: result.data?.currentStatus,
          has_solution_description: !!result.data?.context?.solution_description,
          solution_description: result.data?.context?.solution_description,
          application_text_preview: result.data?.context?.application_text ? 
            result.data.context.application_text.substring(0, 50) + '...' : 
            'отсутствует',
          context_keys: Object.keys(result.data?.context || {})
        });
        console.log('📋 Полные данные заявки:', result.data);
        console.log('═══════════════════════════════════════════════════════════\n');
        
        if (result.success && result.data) {
          setRequestDetails(result.data);
        } else {
          // Если API вернул успех, но без данных, используем данные из карточки
          console.warn('⚠️ API вернул успех, но без данных. Используем данные из карточки.');
          setRequestDetails({
            context: {
              id_portal: request.id,
              application_text: request.description,
            },
            currentStatus: request.status,
            sentAt: request.createdAt,
          });
        }
      } else {
        console.error('❌ Ошибка при загрузке деталей заявки:', response.status);
        // Если не удалось загрузить из API, используем данные из карточки
        setRequestDetails({
          context: {
            id_portal: request.id,
            application_text: request.description,
          },
          currentStatus: request.status,
          sentAt: request.createdAt,
        });
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке деталей заявки:', error);
      // Fallback на данные из карточки
      setRequestDetails({
        context: {
          id_portal: request.id,
          application_text: request.description,
        },
        currentStatus: request.status,
        sentAt: request.createdAt,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- Функция для закрытия Drawer ---
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRequest(null);
    setRequestDetails(null);
  };

  // --- Функция для форматирования даты ---
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
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
    setDbWarningMessage(''); // Сброс предупреждения

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

      // --- 4. Отправляем в ELMA ---
      const elmaResponse = await fetch('/api/elma/post_application', {
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

      // --- 5. Пытаемся сохранить в MongoDB ---
      let dbSaveSuccess = true;
      let dbErrorDetails = null;
      const apiBaseUrl = '';

      try {
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

          dbSaveSuccess = false;
          dbErrorDetails = {
            status: saveToDbResponse.status,
            statusText: saveToDbResponse.statusText,
            error: errorData.error || 'Неизвестная ошибка'
          };
        } else {
          const dbResult = await saveToDbResponse.json();
          console.log('✅ Заявка сохранена в MongoDB:', dbResult);
        }
      } catch (dbError) {
        console.error('❌ Исключение при сохранении в БД:', dbError);
        dbSaveSuccess = false;
        dbErrorDetails = {
          error: dbError.message
        };
      }

      // --- 6. Обновляем список заявок из API ---
      await loadRequestsFromAPI();

      // --- 7. Формируем сообщение и состояние ---
      if (dbSaveSuccess) {
        // Если успешно сохранили в БД
        setSendResult('success');
        setSendMessage(`Заявка ${ticketNumber} успешно отправлена в ELMA и сохранена в базе данных.`);
      } else {
        // Если не удалось сохранить в БД
        setSendResult('db_warning');
        setSendMessage(`Заявка ${ticketNumber} успешно отправлена в ELMA.`);
        setDbWarningMessage(`⚠️ Внимание: Заявка не сохранена в базе данных.\nСтатус: ${dbErrorDetails.status} ${dbErrorDetails.statusText}\nОшибка: ${dbErrorDetails.error}`);
      }

      // Закрываем модальное окно и сбрасываем состояние
      // handleCloseCreate(); // Не закрываем автоматически при предупреждении
    } catch (error) {
      console.error('❌ Ошибка при обработке заявки:', error);
      // --- Устанавливаем состояние ошибки ---
      setSendResult('error');
      setSendMessage(`Не удалось отправить заявку: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // --- Функция для загрузки заявок из API ---
  const loadRequestsFromAPI = async () => {
    try {
      // Используем относительный путь, Vite proxy перенаправит на localhost:3000
      const apiBaseUrl = '';
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
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📥 ФРОНТЕНД: Заявки загружены из API:', result);
      console.log('📊 Количество заявок:', result.data?.length || 0);
      console.log('═══════════════════════════════════════════════════════════');

      if (result.success && Array.isArray(result.data)) {
        // Детальное логирование каждой заявки
        result.data.forEach((item, index) => {
          console.log(`\n📋 Заявка #${index + 1}:`, {
            _id: item._id,
            id_portal: item.context?.id_portal,
            status: item.currentStatus,
            has_solution_description: !!item.context?.solution_description,
            solution_description_preview: item.context?.solution_description ? 
              item.context.solution_description.substring(0, 50) + '...' : 
              'отсутствует',
            application_text_preview: item.context?.application_text ? 
              item.context.application_text.substring(0, 50) + '...' : 
              'отсутствует',
            full_context_keys: Object.keys(item.context || {})
          });
        });
        console.log('═══════════════════════════════════════════════════════════\n');

        const formattedRequests = result.data.map((storageItem) => {
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
        console.log(`✅ Установлено ${formattedRequests.length} заявок из API.`);
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

  // --- Эффект для загрузки заявок из API и периодического обновления ---
  useEffect(() => {
    let loadTimerId;
    let refreshIntervalId;

    loadTimerId = setTimeout(async () => {
      await loadRequestsFromAPI();
      setLoading(false);
      console.log('🏁 Первоначальная загрузка завершена.');

      // Периодически обновляем список заявок (статусы теперь сохраняются напрямую в MongoDB через webhook от ELMA)
      console.log('📡 Запуск периодического обновления списка заявок каждые 10 секунд...');
      refreshIntervalId = setInterval(async () => {
        console.log('🔁 Выполнение периодического обновления списка заявок...');
        await loadRequestsFromAPI();
      }, 10000); // Каждые 10 секунд
    }, 500); // Небольшая задержка для имитации загрузки

    return () => {
      console.log('🧹 Очистка ресурсов компонента...');
      if (loadTimerId) {
        clearTimeout(loadTimerId);
        console.log('⏱️ Таймер загрузки очищен.');
      }
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        console.log('⏰ Интервал обновления остановлен.');
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
          {sendResult === 'success' || sendResult === 'error' || sendResult === 'db_warning' ? (
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
                  {sendResult === 'db_warning' ? (
                    <ErrorOutlineIcon sx={{ fontSize: 60, mb: 1 }} />
                  ) : (
                    <ErrorOutlineIcon sx={{ fontSize: 60, mb: 1 }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {sendResult === 'db_warning' ? 'Предупреждение' : 'Ошибка'}
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ mb: 3 }}>
                {sendMessage}
              </Typography>
              {sendResult === 'db_warning' && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                  {dbWarningMessage}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={handleOkAfterSuccess} // Всегда закрываем по OK
                sx={{
                  color: 'white',
                  backgroundColor: sendResult === 'success' ? 'success.main' : (sendResult === 'db_warning' ? 'warning.main' : 'error.main'),
                  '&:hover': {
                    backgroundColor: sendResult === 'success' ? 'success.dark' : (sendResult === 'db_warning' ? 'warning.dark' : 'error.dark'),
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
              onClick={() => handleRequestClick(request)}
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

      {/* Off-canvas Drawer для просмотра деталей заявки */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 480, md: 600 },
            maxWidth: '90vw',
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Заголовок Drawer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Детали заявки
            </Typography>
            <IconButton onClick={handleDrawerClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Контент Drawer */}
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : requestDetails ? (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {/* Номер заявки и статус */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Номер заявки
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedRequest?.ticketNumber || requestDetails.context?.id_portal || '—'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Статус
                  </Typography>
                  <Chip
                    label={requestDetails.currentStatus || selectedRequest?.status || 'Неизвестно'}
                    size="small"
                    color={statusColors[requestDetails.currentStatus || selectedRequest?.status] || 'default'}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Описание заявки */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DescriptionIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Описание
                  </Typography>
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {requestDetails.context?.application_text || selectedRequest?.description || 'Описание отсутствует'}
                  </Typography>
                </Paper>
              </Box>

              {/* Решение заявки - отображается только если solution_description существует */}
              {requestDetails.context?.solution_description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 20, color: 'success.main' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Решение
                      </Typography>
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: 'success.50',
                        borderRadius: 1,
                        borderColor: 'success.light',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {requestDetails.context.solution_description}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Информация о заявке */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Дата создания
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ pl: 4 }}>
                    {formatDate(requestDetails.sentAt || requestDetails.createdAt || selectedRequest?.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Инициатор
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ pl: 4 }}>
                    {selectedRequest?.initiator || 'Демо-пользователь'}
                  </Typography>
                </Grid>

                {requestDetails.updatedAt && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Последнее обновление
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ pl: 4 }}>
                      {formatDate(requestDetails.updatedAt)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Не удалось загрузить детали заявки
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default SupportRequestsWidget;