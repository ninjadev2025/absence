const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  honor: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, required: true },
  department: { type: String, required: true },
  party: { type: String, required: true },
  sex: { type: String, required: true },
  birthday: { type: Date, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'reporter', 'user'],
    default: 'user',
    required: true
  },
  group: { type: String, required: function () { return this.role === 'reporter'; } }, // Only for reporters
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);