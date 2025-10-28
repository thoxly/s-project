import React from 'react'
import {
  Grid,
  Typography,
  Box,
  Fab,
  Tooltip,
  Zoom,
  CircularProgress,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  BeachAccess as VacationIcon,
  CalendarMonth as CalendarIcon,
  PersonAdd as HireIcon,
  Receipt as DocumentIcon,
  AccountBalance as AccountIcon,
  Flight as BusinessTripIcon,
  ExitToApp as DismissalIcon,
  School as EducationIcon,
  LocalHospital as MedicalIcon,
  Assignment as StatementIcon,
  Inventory as InventoryIcon,
  TrendingUp as PromotionIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Schedule as InProgressIcon,
  Cancel as RejectedIcon,
  PendingActions as StatusIcon
} from '@mui/icons-material'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { useApplicationsState } from "../../hooks/useApplicationsState"
import DraggableCard from "../DraggableCard"

const ApplicationsTab = () => {
  const { widgets, isLoading, isEditMode, reorderWidgets, toggleWidgetWidth, toggleEditMode, resetToDefault } = useApplicationsState()
  const [activeId, setActiveId] = React.useState(null)
  const [selectedApplication, setSelectedApplication] = React.useState(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((item) => item.id === active.id)
      const newIndex = widgets.findIndex((item) => item.id === over.id)
      reorderWidgets(oldIndex, newIndex)
    }
    
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null

  // Данные для блока создания заявок
  const applicationTypes = [
    { 
      id: 1, 
      title: 'Заявление на отпуск', 
      icon: <VacationIcon />, // Убрали color="primary"
      description: 'Подать заявку на ежегодный оплачиваемый отпуск',
      form: 'vacation'
    },
    { 
      id: 2, 
      title: 'График отпусков', 
      icon: <CalendarIcon />,
      description: 'Просмотр и планирование отпусков',
      form: 'schedule'
    },
    { 
      id: 3, 
      title: 'Заявка на трудоустройство нового сотрудника', 
      icon: <HireIcon />,
      description: 'Для руководителей подразделений',
      restricted: true,
      form: 'hire'
    },
    { 
      id: 4, 
      title: 'Заказать справку 2 НДФЛ', 
      icon: <DocumentIcon />,
      description: 'Справка о доходах',
      form: 'certificate'
    },
    { 
      id: 5, 
      title: 'Расчетный листок', 
      icon: <DocumentIcon />,
      description: 'Информация о начислениях и удержаниях',
      form: 'payslip'
    },
    { 
      id: 6, 
      title: 'Заявление о переводе на новую должность', 
      icon: <PromotionIcon />,
      description: 'Заявка на перевод внутри компании',
      form: 'transfer'
    },
    { 
      id: 7, 
      title: 'Заявление на увольнение', 
      icon: <DismissalIcon />,
      description: 'Расторжение трудового договора',
      form: 'dismissal'
    },
    { 
      id: 8, 
      title: 'Заявление на командировку', 
      icon: <BusinessTripIcon />,
      description: 'Оформление служебной командировки',
      form: 'business-trip'
    },
    { 
      id: 9, 
      title: 'Заявление об открытии счета (з/п карта)', 
      icon: <AccountIcon />,
      description: 'Изменение реквизитов для заработной платы',
      form: 'account'
    },
    { 
      id: 10, 
      title: 'Справка о налоговом вычете', 
      icon: <DocumentIcon />,
      description: 'Документы для налоговых вычетов',
      form: 'tax-deduction'
    },
    { 
      id: 11, 
      title: 'Справка с места работы', 
      icon: <StatementIcon />,
      description: 'Официальная справка о трудоустройстве',
      form: 'employment-certificate'
    },
    { 
      id: 12, 
      title: 'Записать ребенка в ДС/школу', 
      icon: <EducationIcon />,
      description: 'Помощь с устройством детей в образовательные учреждения',
      form: 'child-education'
    },
    { 
      id: 13, 
      title: 'Записаться в медицинский центр "С"', 
      icon: <MedicalIcon />,
      description: 'Корпоративное медицинское обслуживание',
      form: 'medical-center'
    },
    { 
      id: 14, 
      title: 'Записаться в поликлинику университета "С"', 
      icon: <MedicalIcon />,
      description: 'Медицинское обслуживание в университетской поликлинике',
      form: 'university-clinic'
    },
    { 
      id: 15, 
      title: 'Инвентаризация', 
      icon: <InventoryIcon />,
      description: 'Заявки по учету материальных ценностей',
      form: 'inventory'
    },
  ]

  // Данные для блока статусов заявок
  const statusData = [
    { 
      id: 1, 
      title: 'Заявление на отпуск', 
      status: 'approved', 
      date: '15.01.2024', 
      number: 'ЗА-001',
      icon: <VacationIcon />
    },
    { 
      id: 2, 
      title: 'Справка 2 НДФЛ', 
      status: 'in-progress', 
      date: '14.01.2024', 
      number: 'ЗА-002',
      icon: <DocumentIcon />
    },
    { 
      id: 3, 
      title: 'Заявление на командировку', 
      status: 'pending', 
      date: '13.01.2024', 
      number: 'ЗА-003',
      icon: <BusinessTripIcon />
    },
    { 
      id: 4, 
      title: 'Расчетный листок', 
      status: 'rejected', 
      date: '12.01.2024', 
      number: 'ЗА-004',
      icon: <DocumentIcon />
    },
  ]

  const handleApplicationClick = (applicationType) => {
    setSelectedApplication(applicationType)
    setIsDialogOpen(true)
    setActiveStep(0)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedApplication(null)
    setActiveStep(0)
  }

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmitApplication = () => {
    // Здесь будет логика отправки заявки
    console.log('Отправка заявки:', selectedApplication)
    handleCloseDialog()
    // Можно добавить уведомление об успешной отправке
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'success', icon: <ApprovedIcon />, text: 'Утверждена' }
      case 'in-progress':
        return { color: 'info', icon: <InProgressIcon />, text: 'В работе' }
      case 'pending':
        return { color: 'warning', icon: <PendingIcon />, text: 'На рассмотрении' }
      case 'rejected':
        return { color: 'error', icon: <RejectedIcon />, text: 'Отклонена' }
      default:
        return { color: 'default', icon: <PendingIcon />, text: status }
    }
  }

  // Компонент блока создания заявок
  const CreateApplicationBlock = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Выберите тип заявки
      </Typography>
      
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {applicationTypes.map((app, index) => (
          <React.Fragment key={app.id}>
            <ListItem 
              button 
              onClick={() => handleApplicationClick(app)}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                py: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                {app.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {app.title}
                    </Typography>
                    {app.restricted && (
                      <Chip 
                        label="Только руководители" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {app.description}
                  </Typography>
                }
              />
            </ListItem>
            {index < applicationTypes.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )

  // Компонент блока статусов заявок
  const ApplicationStatusBlock = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Текущие заявки
      </Typography>
      
      <List sx={{ py: 0, mb: 2 }}>
        {statusData.map((item) => {
          const statusConfig = getStatusConfig(item.status)
          return (
            <ListItem 
              key={item.id}
              sx={{ 
                borderRadius: 2,
                mb: 2,
                py: 2,
                backgroundColor: alpha('#fff', 0.7),
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.title}
                    </Typography>
                    <Chip 
                      icon={statusConfig.icon}
                      label={statusConfig.text} 
                      size="small" 
                      color={statusConfig.color}
                      variant="filled"
                      sx={{ minWidth: 120 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      № {item.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          size="large"
          sx={{ minWidth: 200 }}
        >
          Вся история заявок
        </Button>
      </Box>
    </Box>
  )

  // Рендеринг формы для выбранного типа заявки
  const renderApplicationForm = () => {
    if (!selectedApplication) return null

    const steps = ['Основная информация', 'Дополнительные данные', 'Подтверждение']
    
    const renderStepContent = (step) => {
      switch (step) {
        case 0:
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Тема заявки"
                value={selectedApplication.title}
                disabled
                fullWidth
              />
              <TextField
                label="Описание"
                placeholder="Опишите детали вашей заявки..."
                multiline
                rows={4}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Приоритет</InputLabel>
                <Select label="Приоритет" defaultValue="normal">
                  <MenuItem value="low">Низкий</MenuItem>
                  <MenuItem value="normal">Обычный</MenuItem>
                  <MenuItem value="high">Высокий</MenuItem>
                  <MenuItem value="urgent">Срочный</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )
        case 1:
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Дополнительная информация для {selectedApplication.title}
              </Typography>
              <TextField
                label="Дата начала"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Дата окончания"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Комментарий"
                placeholder="Дополнительные комментарии..."
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          )
        case 2:
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                Проверьте данные заявки
              </Typography>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography><strong>Тип заявки:</strong> {selectedApplication.title}</Typography>
                <Typography><strong>Описание:</strong> Заявка на рассмотрение</Typography>
                <Typography><strong>Приоритет:</strong> Обычный</Typography>
                <Typography><strong>Статус:</strong> Ожидает рассмотрения</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                После отправки заявка будет направлена на рассмотрение. Вы сможете отслеживать её статус в блоке "Статус заявок".
              </Typography>
            </Box>
          )
        default:
          return null
      }
    }

    return (
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedApplication.icon}
            <Typography variant="h6">{selectedApplication.title}</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>
            Отмена
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep > 0 && (
            <Button onClick={handlePrevStep}>
              Назад
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNextStep}>
              Далее
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmitApplication}>
              Отправить заявку
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )
  }

  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'create-application':
        return <CreateApplicationBlock />
      case 'application-status':
        return <ApplicationStatusBlock />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Загрузка заявок...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Заголовок и кнопка настроек */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Подача и отслеживание заявок
          </Typography>
        </Box>
        
        <Tooltip title={isEditMode ? "Выйти из режима редактирования" : "Настроить расположение блоков"}>
          <Fab
            size="small"
            color={isEditMode ? "primary" : "default"}
            onClick={toggleEditMode}
          >
            <SettingsIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Контент вкладки заявок */}
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
            <Box
              sx={{
                minHeight: 400,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(30, 64, 175, 0.01) 100%)',
                border: '3px dashed',
                borderColor: activeId ? 'primary.main' : 'primary.light',
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: 'primary.main' }}>
                Режим редактирования • Перетаскивайте блоки заявок
              </Typography>
              
              <Grid container spacing={3}>
                {widgets.map((widget, index) => (
                  <Grid item xs={12} md={widget.width === 'half' ? 6 : 12} key={widget.id}>
                    <DraggableCard
                      id={widget.id}
                      index={index}
                      title={widget.title}
                      icon={widget.icon}
                      color={widget.color}
                      onToggleWidth={toggleWidgetWidth}
                      width={widget.width}
                      isEditMode={isEditMode}
                    >
                      {renderWidgetContent(widget.id)}
                    </DraggableCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SortableContext>
          
          <DragOverlay>
            {activeWidget ? (
              <Box sx={{ width: 360, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3, p: 2 }}>
                <Typography variant="h6">{activeWidget.title}</Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Grid container spacing={3}>
          {widgets.map((widget, index) => (
            <Grid item xs={12} md={widget.width === 'half' ? 6 : 12} key={widget.id}>
              <Zoom in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <div>
                  <DraggableCard
                    id={widget.id}
                    index={index}
                    title={widget.title}
                    icon={widget.icon}
                    color={widget.color}
                    onToggleWidth={toggleWidgetWidth}
                    width={widget.width}
                    isEditMode={isEditMode}
                  >
                    {renderWidgetContent(widget.id)}
                  </DraggableCard>
                </div>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Модальное окно создания заявки */}
      {renderApplicationForm()}

      {/* Кнопка сброса настроек */}
      {isEditMode && (
        <Zoom in={isEditMode}>
          <Tooltip title="Сбросить расположение блоков">
            <Fab
              color="secondary"
              onClick={resetToDefault}
              sx={{ position: 'fixed', bottom: 24, right: 24 }}
            >
              <RefreshIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      )}
    </>
  )
}

export default ApplicationsTab