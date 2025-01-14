const mongoose = require('mongoose');

const membershipRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membershipType: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    price: { type: Number, required: true },
    durationInMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipRequest', membershipRequestSchema);
