// Create mechanic
const Mechanic = require('../models/Mechanic');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create mechanic
exports.createMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Access denied' });

    const { name, email, phone, password, specialization, experience } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    const existingMechanic = await Mechanic.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingMechanic || existingUser)
      return res.status(400).json({ msg: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'mechanic',
    });
    
    const mechanic = await Mechanic.create({
      name,
      email,
      phone,
      specialization,
      experience,
      user: user._id,
    });

   

    res.status(201).json({
      msg: 'Mechanic created successfully',
      mechanic,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get all mechanics
exports.getMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find().sort({ createdAt: -1 });
    res.json(mechanics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update mechanic
exports.updateMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Access denied' });

    const { id } = req.params;
    const updates = req.body;

    const mechanic = await Mechanic.findByIdAndUpdate(id, updates, { new: true });
    if (!mechanic) return res.status(404).json({ msg: 'Mechanic not found' });

    res.json({ msg: 'Mechanic updated successfully', mechanic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete mechanic
exports.deleteMechanic = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Access denied' });

    const { id } = req.params;
    const mechanic = await Mechanic.findById(id);
    if (!mechanic) return res.status(404).json({ msg: 'Mechanic not found' });

    // Delete from User collection too
    await User.deleteOne({ email: mechanic.email });

    await mechanic.deleteOne();
    res.json({ msg: 'Mechanic deleted successfully from both Mechanic and User collections' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

