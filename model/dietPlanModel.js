const mongoose = require('mongoose');
const dietPlanSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
      dietType: { type: String, enum: ['weight loss', 'muscle gain', 'maintenance'], required: true },
      meals: [
        {
          time: { type: String, required: true }, // e.g., "Breakfast"
          description: { type: String, required: true },
        },
      ],
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('DietPlan', dietPlanSchema);
  