const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, required: true },
      checkInTime: { type: String },
      checkOutTime: { type: String },
      status: { type: String, enum: ['present', 'absent'], required: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Attendance', attendanceSchema);
  