const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/users/:id', authMiddleware, getUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;