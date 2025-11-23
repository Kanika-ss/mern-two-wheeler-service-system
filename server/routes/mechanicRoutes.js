const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMechanicBookings, updateBookingStatus } = require('../controllers/bookingController');

router.use(authMiddleware);

// Get bookings assigned to mechanic
router.get('/bookings', getMechanicBookings);

// Update assigned booking
router.post('/update', updateBookingStatus);

module.exports = router;
