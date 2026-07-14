const express = require('express');
const router = express.Router();

const { 
  createItem,
  getItems,
  getItemById,
  verifyItem,
  updateStatus,
  deleteItem,
  getStats
} = require('../controllers/itemController');

const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('photo'), createItem);
router.get('/', getItems);
router.get('/stats/summary', getStats);
router.get('/:id', getItemById);
router.patch('/:id/verify', authMiddleware, adminOnly, verifyItem);
router.patch('/:id/status', authMiddleware, updateStatus);
router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;