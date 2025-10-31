const mongoose = require('mongoose');

const contactInformationSchema = new mongoose.Schema({
  login: String,
  type: String,
  email: String
}, { _id: false });

const applicationTypeSchema = new mongoose.Schema({
  code: String,
  name: String
}, { _id: false });

const prioritySchema = new mongoose.Schema({
  code: String,
  name: String
}, { _id: false });

const criticalitySchema = new mongoose.Schema({
  code: String,
  name: String
}, { _id: false });

const urgencySchema = new mongoose.Schema({
  code: String,
  name: String
}, { _id: false });

const slaIndicatorRowSchema = new mongoose.Schema({
  __id: String,
  __count: mongoose.Schema.Types.Mixed,
  sla_level: [String],
  reaction_time_string: String,
  solution_time_string: String,
  reaction_time_seconds: Number,
  solution_time_seconds: mongoose.Schema.Types.Mixed,
  reaction_time_string_fact: String,
  solution_time_string_fact: String
}, { _id: false });

const tableOfSlaIndicatorsSchema = new mongoose.Schema({
  rows: [slaIndicatorRowSchema],
  view: String,
  result: mongoose.Schema.Types.Mixed
}, { _id: false });

const workingMailSchema = new mongoose.Schema({
  type: String,
  email: String
}, { _id: false });

const supportRequestSchema = new mongoose.Schema({
  // Основные поля из context
  context: {
    application_type: [applicationTypeSchema],
    priority: [prioritySchema],
    criticality: [criticalitySchema],
    urgency: [urgencySchema],
    topic: String,
    contact_information: [contactInformationSchema],
    responsible: [String],
    service: [String],
    client_type: {
      type: Boolean,
      default: false
    },
    working_mail: [workingMailSchema],
    table_of_sla_indicators: tableOfSlaIndicatorsSchema,
    sla_level: [String],
    id_portal: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    aplicant: [String],
    application_text: {
      type: String,
      required: true
    },
    contact_information_secondary: [contactInformationSchema] // второй массив contact_information из структуры
  },
  
  // Дополнительные поля для управления
  sentAt: {
    type: Date,
    default: Date.now
  },
  currentStatus: {
    type: String,
    default: 'Новая',
    enum: ['Новая', 'В работе', 'На уточнении', 'Закрыта', 'Отложена', 'Отменена', 'Выполнена'],
    index: true
  },
  
  // Поля для связи с пользователем (если нужно)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // Метаданные
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновление updatedAt перед сохранением
supportRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Индексы для быстрого поиска
supportRequestSchema.index({ 'context.id_portal': 1 });
supportRequestSchema.index({ currentStatus: 1 });
supportRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);

