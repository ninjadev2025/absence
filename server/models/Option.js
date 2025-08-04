const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['honor', 'level', 'department', 'party', 'group'] },
  value: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Option', OptionSchema);