const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Feedback', feedbackSchema);
  