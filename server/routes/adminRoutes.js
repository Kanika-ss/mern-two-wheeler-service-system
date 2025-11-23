const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllBookings,
  assignMechanic,
  updateBookingStatus,
  getAllUsers,
  getMechanicBookings
} = require('../controllers/bookingController');


const {
  createMechanic,
  getMechanics,
  updateMechanic,
  deleteMechanic
} = require('../controllers/mechanicController');


router.use(authMiddleware);

router.get('/bookings', getAllBookings);
router.post('/assign-mechanic', assignMechanic);
router.post('/update-booking', updateBookingStatus);
router.get('/users', getAllUsers);

// Mechanic CRUD Routes
router.post('/mechanics', createMechanic); // Create
router.get('/mechanics', getMechanics); // Read
router.put('/mechanics/:id', updateMechanic); // Update
router.delete('/mechanics/:id', deleteMechanic); // Delete


// Get bookings assigned to logged-in mechanic
router.get('/mechanic/bookings', authMiddleware, getMechanicBookings);


module.exports = router;
