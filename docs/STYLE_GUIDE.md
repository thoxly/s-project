# Руководство по стилям Portal S

## Обзор

Этот документ содержит стандарты стилей для фронтенда Portal S, основанные на Material-UI (MUI) с современным дизайном.

## Цветовая палитра

### Основные цвета

- **Primary (Основной)**: `#1e3a8a` - Глубокий синий
- **Secondary (Вторичный)**: `#059669` - Изумрудно-зеленый
- **Error (Ошибка)**: `#dc2626` - Красный
- **Warning (Предупреждение)**: `#d97706` - Оранжевый
- **Info (Информация)**: `#0ea5e9` - Голубой
- **Success (Успех)**: `#059669` - Зеленый

### Фоновые цвета

- **Background Default**: `#f8fafc` - Светло-серый
- **Background Paper**: `#ffffff` - Белый

### Текстовые цвета

- **Primary Text**: `#1e293b` - Темно-серый
- **Secondary Text**: `#64748b` - Средне-серый

## Типографика

### Шрифт

- **Основной шрифт**: Inter, Roboto, Helvetica, Arial, sans-serif
- **Размеры заголовков**:
  - H1: 2.5rem, вес 700
  - H2: 2rem, вес 600
  - H3: 1.5rem, вес 600
  - H4: 1.25rem, вес 600
  - H5: 1.125rem, вес 600
  - H6: 1rem, вес 600

### Стили текста

- **Body1**: 1rem, line-height 1.6
- **Body2**: 0.875rem, line-height 1.6
- **Button**: вес 500, без трансформации текста

## Компоненты

### Кнопки

```jsx
// Стандартная кнопка
<Button
  variant="contained"
  sx={{
    borderRadius: 2,
    fontWeight: 500,
    textTransform: 'none'
  }}
>
  Текст кнопки
</Button>

// Кнопка с hover эффектом
<Button
  variant="outlined"
  sx={{
    '&:hover': {
      backgroundColor: 'primary.main',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
    },
    transition: 'all 0.2s ease-in-out'
  }}
>
  Кнопка с эффектом
</Button>
```

### Карточки

```jsx
<Card
  sx={{
    borderRadius: 3,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    "&:hover": {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease-in-out",
  }}
>
  <CardContent>Содержимое карточки</CardContent>
</Card>
```

### Бумага (Paper)

```jsx
<Paper
  variant="outlined"
  sx={{
    p: 3,
    borderRadius: 2,
    border: "1px solid #e2e8f0",
    backgroundColor: "rgba(30, 58, 138, 0.05)",
    "&:hover": {
      backgroundColor: "rgba(30, 58, 138, 0.08)",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease-in-out",
  }}
>
  Содержимое
</Paper>
```

### Аватары

```jsx
<Avatar
  sx={{
    bgcolor: "primary.main",
    width: 40,
    height: 40,
  }}
>
  <Icon />
</Avatar>
```

## Spacing (Отступы)

Используйте систему spacing MUI (8px базовая единица):

- `sx={{ p: 1 }}` = 8px
- `sx={{ p: 2 }}` = 16px
- `sx={{ p: 3 }}` = 24px
- `sx={{ p: 4 }}` = 32px

## Анимации и переходы

### Стандартные переходы

```jsx
sx={{
  transition: 'all 0.2s ease-in-out'
}}
```

### Hover эффекты

```jsx
sx={{
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }
}}
```

## Адаптивный дизайн

### Breakpoints

- **xs**: 0px и выше
- **sm**: 600px и выше
- **md**: 900px и выше
- **lg**: 1200px и выше
- **xl**: 1536px и выше

### Пример адаптивного контейнера

```jsx
<Container
  maxWidth="xl"
  sx={{
    py: 4,
    px: { xs: 2, sm: 3, md: 4 },
  }}
>
  Контент
</Container>
```

## Тени (Box Shadow)

### Стандартные тени

- **Карточка**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **Hover карточка**: `0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)`
- **Кнопка hover**: `0 4px 12px rgba(0, 0, 0, 0.15)`

## Градиенты

### Навигационная панель

```jsx
sx={{
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
}}
```

### Текст с градиентом

```jsx
sx={{
  background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}
```

## Чипы (Chips)

```jsx
<Chip
  label="Статус"
  color="primary"
  variant="outlined"
  sx={{
    borderRadius: 2,
    fontWeight: 500,
  }}
/>
```

## Рекомендации

1. **Консистентность**: Всегда используйте одинаковые отступы, радиусы и тени
2. **Доступность**: Обеспечивайте достаточный контраст цветов
3. **Производительность**: Используйте CSS-in-JS эффективно, избегайте избыточных стилей
4. **Адаптивность**: Тестируйте на разных размерах экрана
5. **Анимации**: Используйте плавные переходы, но не переусложняйте

## Примеры использования

### Заголовок страницы

```jsx
<Typography
  variant="h3"
  sx={{
    fontWeight: 700,
    color: "text.primary",
    mb: 2,
  }}
>
  Заголовок страницы
</Typography>
```

### Статистическая карточка

```jsx
<Paper
  variant="outlined"
  sx={{
    p: 3,
    textAlign: "center",
    backgroundColor: "primary.light",
    backgroundColor: "rgba(30, 58, 138, 0.05)",
    border: "1px solid",
    borderColor: "primary.light",
  }}
>
  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
    42
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Активных пользователей
  </Typography>
</Paper>
```

Этот стиль-гайд обеспечивает единообразный и современный вид всего приложения Portal S.
