const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile  } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// new route to get currently logged-in user
router.get('/me', authMiddleware, getMe);

router.put('/update-profile', authMiddleware, updateProfile);

module.exports = router;
