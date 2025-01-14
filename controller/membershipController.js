const Membership = require('../model/membershipModel');
const User = require('../model/userModel');

// Create a new membership
const createMembership = async (req, res) => {
  const { membershipType, price, durationInMonths, startDate, endDate, user } = req.body;

  try {
    // Check if all required fields are provided
    if (!membershipType || !price || !durationInMonths || !startDate || !endDate || !user) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has an active membership
    const existingMembership = await Membership.findOne({ user, endDate: { $gte: new Date() } });
    if (existingMembership) {
      return res.status(400).json({ message: 'User already has an active membership' });
    }

    // Create a new membership
    const newMembership = new Membership({
      membershipType,
      price, 
      durationInMonths,
      startDate,
      endDate,
      user,
    });

    // Save the new membership
    const savedMembership = await newMembership.save();

    // Update the user's membership status to active
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { membershipStatus: 'active' },
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json({
      message: 'Membership created successfully',
      membership: savedMembership,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get all users with memberships
const getAllMembershipUsers = async (req, res) => {
  try {
    const memberships = await Membership.find().populate('user');
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  createMembership,
  getAllMembershipUsers,
};
