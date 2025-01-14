const mongoose = require('mongoose');
const workoutPlanSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
      planName: { type: String, required: true },
      exercises: [
        {
          name: { type: String, required: true },
          sets: { type: Number, required: true },
          reps: { type: Number, required: true },
        },
      ],
      durationInWeeks: { type: Number, required: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
  