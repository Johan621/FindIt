const User = require('../models/User');

// Get all blocked users
exports.getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await User.find({ isBlocked: true }).select('name email isBlocked spamAttempts');
    res.status(200).json(blockedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false;
    user.spamAttempts = 0;
    await user.save();

    res.status(200).json({ message: 'User unblocked successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
