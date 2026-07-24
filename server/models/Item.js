const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  date: {
    type: Date,
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'matched', 'recovered', 'rejected'],
    default: 'pending'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

// Indexes for performance
itemSchema.index({ status: 1, type: 1, createdAt: -1 });
itemSchema.index({ reportedBy: 1, createdAt: -1 });
itemSchema.index({ category: 1 });
itemSchema.index({ location: 1 });
// Text index for search keyword
itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);