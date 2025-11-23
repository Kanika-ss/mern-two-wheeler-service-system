const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require login
router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.put('/:id', authMiddleware, updateBooking);
router.delete('/:id', authMiddleware, deleteBooking);

module.exports = router;
