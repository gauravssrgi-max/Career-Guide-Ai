const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['course', 'book', 'video', 'platform', 'article', 'tool'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: 'Free',
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
  },
  provider: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

resourceSchema.index({ careerId: 1 });
resourceSchema.index({ type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
