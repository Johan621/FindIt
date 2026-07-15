const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getConversations,
  getMessagesForConversation,
  markConversationAsRead
} = require('../controllers/messageController');

const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/conversation/:itemId/:otherUserId', authMiddleware, getMessagesForConversation);
router.patch('/conversation/:itemId/:otherUserId/read', authMiddleware, markConversationAsRead);

module.exports = router;
