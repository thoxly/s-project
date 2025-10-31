import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Divider,
  Tooltip,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';


const ServiceCard = ({ id, title, desc, category }) => {
  const [openDetail, setOpenDetail] = useState(false); // ← модалка "Подробнее"
  const [openCreate, setOpenCreate] = useState(false); // ← модалка "Создать" (только для admin)
  const [description, setDescription] = useState('');   // ← текст в поле "Описание"
  const [isSending, setIsSending] = useState(false);   // ← состояние загрузки

  // Обработчики модалки "Подробнее"
  const handleOpenDetail = () => setOpenDetail(true);
  const handleCloseDetail = () => setOpenDetail(false);
  function generateUUIDv4() {
  // Возвращаем сразу отформатированную строку, генерируя части динамически
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // Генерируем случайное число от 0 до 15
    const r = Math.random() * 16 | 0;
    // Для 'y' маскируем биты, чтобы получить 8, 9, A или B
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    // Преобразуем в шестнадцатеричную строку
    return v.toString(16);
  });
}
  const defaultRequestContext = {
  "context": {
    "application_type": [
      {
        "code": "zno",
        "name": "ЗНО"
      }
    ],
    "priority": [
      {
        "code": "middle",
        "name": "Средний"
      }
    ],
    "criticality": [
      {
        "code": "middle",
        "name": "Средняя"
      }
    ],
    "urgency": [
      {
        "code": "medium",
        "name": "Средняя"
      }
    ],
    "topic": "Критический сбой в 1С:Бухгалтерия, ошибка прав доступа. Срыв сроков отчетности.",
    "contact_information": [
      {
        "login": "example",
        "type": "telegram"
      }
    ],
    "responsible": [
      "25f18c44-3d05-4b92-8dbf-b69b4a721b53"
    ],
    "service": [
      "019a2fab-8b5e-76ad-b2e3-86347f749a67"
    ],
    "client_type": false,
    "working_mail": [
      {
        "type": "work",
        "email": "mail@example.com"
      }
    ],
    "table_of_sla_indicators": {
      "rows": [
        {
          "__id": "019a2fba-b10b-7078-a983-ab7f362e4989",
          "__count": null,
          "sla_level": [
            "019a2fac-abcd-70b8-9c8f-40cfedc70ea0"
          ],
          "reaction_time_string": "2 часа",
          "solution_time_string": "2 часа",
          "reaction_time_seconds": 40.253,
          "solution_time_seconds": null,
          "reaction_time_string_fact": "40 секунд",
          "solution_time_string_fact": "0 минут"
        }
      ],
      "view": "",
      "result": null
    },
    "sla_level": [
      "019a2fac-abcd-70b8-9c8f-40cfedc70ea0"
    ],
  "id_portal": generateUUIDv4(),
    "aplicant": [
      "019a2f92-8bf9-737b-96e8-b218caca58c6"
    ],
    "application_text": "Сегодня утром в 10:00 при попытке запустить 1С:Бухгалтерия для формирования квартального отчета программа выдает ошибку 'Нарушение прав доступа по адресу 0x0045A19B' и закрывается. Произвела перезагрузку ПК и повторный вход в систему — проблема сохраняется. Сегодня до 18:00 необходимо сдать электронный отчет в ФНС. Работа полностью парализована. Прошу устранить сбой в экстренном порядке.\n\n",
    "contact_information": [
      {
        "type": "other",
        "login": "kds+333@axonteam.ru"
      }
    ]
  }
}
  // Обработчики модалки "Создать" (только для admin)
  const handleOpenCreate = () => {
    if (id === 'admin') {
      setOpenCreate(true); // Открыть модалку
    } else {
      alert('Недоступно в демо-версии');
    }
  };

 const handleSend = async () => {
  setIsSending(true);

  try {
    // Создаём копию объекта и подставляем текущее описание
    const requestToSend = {
      ...defaultRequestContext,
      context: {
        ...defaultRequestContext.context,
        application_text: description, // подставляем текст из поля "Описание"
      }
    };

    // Отправляем на сервер
    const serverResponse = await fetch('https://api-surius.ru.tuna.am/api/elma/post_application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestToSend),
    });

    if (!serverResponse.ok) {
      throw new Error(`Ошибка сервера: ${serverResponse.status} ${serverResponse.statusText}`);
    }

    const serverResult = await serverResponse.json();
    console.log('✅ Заявка успешно отправлена на сервер:', serverResult);

    // Только после успешного ответа — сохраняем в localStorage БЕЗ ответа сервера
    const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    existingApplications.push({
      ...requestToSend,
      sentAt: new Date().toISOString(), // Добавляем временную метку
      // serverResponse: serverResult, // <- Убираем это
    });
    localStorage.setItem('applications', JSON.stringify(existingApplications));

    console.log('💾 Заявка сохранена в localStorage (без ответа сервера)');

    // Закрываем модальное окно и сбрасываем состояние
    handleCloseCreate();
  } catch (error) {
    console.error('❌ Ошибка при обработке заявки:', error);
    alert('Не удалось обработать заявку: ' + error.message);
  } finally {
    setIsSending(false);
  }
};

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setDescription('');
  };

  const handleSubmit = () => {
    alert('Недоступно в демо-версии');
    handleCloseCreate();
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          mb: 1.5,
          cursor: 'grab',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {desc}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              onClick={handleOpenDetail}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'grey.400',
                color: 'grey.700',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(30, 58, 138, 0.05)',
                },
              }}
            >
              Подробнее
            </Button>
            <Button
              onClick={handleOpenCreate} // ← теперь проверяет id
              size="small"
              variant="contained"
              color="primary"
            >
              Создать
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* === Модальное окно "Подробнее" (старое) === */}
      <Modal open={openDetail} onClose={handleCloseDetail}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {desc}
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Категория: {category}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseDetail}>
            Закрыть
          </Button>
        </Box>
      </Modal>

      {/* === Модальное окно "Создать" (только для admin) === */}
      {id === 'admin' && (
        <Modal open={openCreate} onClose={handleCloseCreate}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
            }}
          >
            <Typography sx={{padding:'0 0 8px 0'}} variant="h6" fontWeight={600} gutterBottom>
              {title}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
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
                    }
                  }}
                >
                  Прикрепить
                </Button>
              </Tooltip>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
                <Button onClick={handleCloseCreate} disabled={isSending}>
                  Отмена
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={description.length===0 ||isSending} // Отключаем кнопку во время отправки
                  sx={{
                    color: 'white',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  {isSending ? 'Отправка...' : 'Отправить'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ServiceCard;