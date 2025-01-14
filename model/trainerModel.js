const mongoose = require('mongoose');
const trainerSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      expertise: { type: [String], required: true },
      availability: { type: String, required: true }, // e.g., "Monday to Friday, 9 AM - 5 PM"
      assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      contact: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Trainer', trainerSchema);
  