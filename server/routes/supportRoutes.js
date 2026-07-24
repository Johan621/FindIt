const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// POST /api/support
// Public route for contacting support
router.post('/', supportController.submitContactForm);

module.exports = router;
