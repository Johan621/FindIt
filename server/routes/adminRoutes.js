const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Ensure user is an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

// GET /api/admin/blocked-users
router.get('/blocked-users', auth, adminOnly, adminController.getBlockedUsers);

// PUT /api/admin/users/:id/unblock
router.put('/users/:id/unblock', auth, adminOnly, adminController.unblockUser);

module.exports = router;
