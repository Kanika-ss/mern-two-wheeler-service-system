const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bikeModel: { type: String, required: true },
    bikeBrand: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    serviceType: { type: String, enum: ['General Service', 'Oil Change', 'Repair', 'Battery Replacement', 'Tyre Service'], required: true },
    pickupAddress: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Completed'], default: 'Pending' },
    assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },
    cost: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
