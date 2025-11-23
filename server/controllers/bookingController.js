const Booking = require('../models/Booking');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');

// Admin: get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const bookings = await Booking.find().populate('user', 'name email').populate('assignedMechanic', '_id name email');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Assign mechanic to booking
exports.assignMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Access denied' });

    const { bookingId, mechanicId } = req.body;
    if (!bookingId || !mechanicId)
      return res.status(400).json({ msg: 'Booking ID and Mechanic ID are required' });


    // Validate mechanic and booking existence
    const mechanic = await Mechanic.findById(mechanicId).populate('user');
    const booking = await Booking.findById(bookingId);

    if (!mechanic) return res.status(404).json({ msg: 'Mechanic not found' });
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.assignedMechanic = mechanic.user;  // ✅ user._id, not mechanic._id
    booking.status = 'Assigned';
    await booking.save();



    // Populate before sending response
    const updatedBooking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('assignedMechanic', '_id name email');

    res.json({ msg: `Mechanic assigned successfully to ${booking._id}`, booking: updatedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Admin / Mechanic: update status and remarks
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, remarks, cost } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    
    // Mechanic can only update assigned bookings
    if (req.user.role === 'mechanic' && booking.assignedMechanic?.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    if (status) booking.status = status;
    if (remarks) booking.remarks = remarks;
    if (cost !== undefined) booking.cost = cost;

    await booking.save();

    res.json({ msg: 'Booking updated', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: manage users (list all)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const users = await User.find().select('password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Mechanic: get bookings assigned to logged-in mechanic
exports.getMechanicBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedMechanic: req.user.id })
      .populate('user', 'name email')
      .populate('assignedMechanic', '_id name email');


    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { bikeModel, bikeBrand, registrationNumber, serviceType, pickupDate, pickupTime, preferredDate, preferredTime, pickupAddress } = req.body;

    if (!bikeModel || !bikeBrand || !registrationNumber || !serviceType || !pickupAddress || !pickupDate || !pickupTime || !preferredDate || !preferredTime) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check overlapping booking for the same user at same date/time
    const existing = await Booking.findOne({
      user: req.user.id,
      pickupDate: new Date(pickupDate),
      pickupTime,
    });

    if (existing) {
      return res.status(400).json({ msg: 'You already have a booking at this date/time' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      bikeModel,
      bikeBrand,
      registrationNumber,
      serviceType,
      pickupAddress,
      pickupDate: new Date(pickupDate),
      pickupTime,
      deliveryDate: new Date(preferredDate),
      deliveryTime: preferredTime,
    });

    res.status(201).json({ msg: 'Booking created successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all bookings of logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ preferredDate: -1 }).populate('assignedMechanic', '_id name email');;
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    if (booking.status !== 'Pending') return res.status(400).json({ msg: 'Cannot edit once assigned or in progress' });

    const {bikeModel,bikeBrand,registrationNumber,serviceType,pickupAddress,pickupDate,pickupTime,preferredDate,preferredTime} = req.body;
    
    if (!bikeModel || !bikeBrand || !registrationNumber || !serviceType || !pickupAddress || !pickupDate || !pickupTime || !preferredDate || !preferredTime) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    Object.assign(booking, {
      bikeModel,
      bikeBrand,
      registrationNumber,
      serviceType,
      pickupAddress,
      pickupDate: new Date(pickupDate),
      pickupTime,
      deliveryDate: new Date(preferredDate),
      deliveryTime: preferredTime,
    });

    await booking.save();
    res.json({ msg: 'Booking updated successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    if (booking.status !== 'Pending') return res.status(400).json({ msg: 'Cannot delete once assigned or in progress' });

    await booking.deleteOne();
    res.json({ msg: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
