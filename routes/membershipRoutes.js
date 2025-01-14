const express = require('express');
const { createMembership, getAllMembershipUsers } = require('../controller/membershipController');
const router = express.Router();

// Create a new membership
router.post('/create-membership', createMembership);

// Get all memberships
router.get('/all-membership-user', getAllMembershipUsers);

module.exports = router;