const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    default: 'General Service',
  },
  experience: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Available', 'Busy', 'Inactive'],
    default: 'Available',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mechanic', mechanicSchema);
