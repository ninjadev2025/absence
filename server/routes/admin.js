const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Option = require('../models/Option');
const auth = require('../middleware/auth');

// Middleware to verify admin
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all users
router.get('/users', auth, adminCheck, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get specific user
router.get('/users/:id', auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user
router.put('/users/:id', auth, adminCheck, async (req, res) => {
  try {
    const { name, level, department, party, role, group } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, level, department, party, role, group },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Change user password
router.put('/users/:id/password', auth, adminCheck, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminCheck, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get all options
router.get('/options', auth, adminCheck, async (req, res) => {
  try {
    const options = await Option.find().sort({ type: 1, value: 1 });
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching options' });
  }
});

// Add new option
router.post('/options', auth, adminCheck, async (req, res) => {
  try {
    const { type, value } = req.body;
    
    if (!['honor', 'level', 'department', 'party', 'group'].includes(type)) {
      return res.status(400).json({ message: 'Invalid option type' });
    }
    
    if (!value || value.trim() === '') {
      return res.status(400).json({ message: 'Value is required' });
    }
    
    const existingOption = await Option.findOne({ type, value });
    if (existingOption) {
      return res.status(400).json({ message: 'Option already exists' });
    }
    
    const option = new Option({ type, value });
    await option.save();
    
    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ message: 'Error adding option' });
  }
});

// Update option
router.put('/options/:id', auth, adminCheck, async (req, res) => {
  try {
    const { value } = req.body;
    
    if (!value || value.trim() === '') {
      return res.status(400).json({ message: 'Value is required' });
    }
    
    const option = await Option.findByIdAndUpdate(
      req.params.id,
      { value },
      { new: true }
    );
    
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }
    
    res.json(option);
  } catch (error) {
    res.status(500).json({ message: 'Error updating option' });
  }
});

// Delete option
router.delete('/options/:id', auth, adminCheck, async (req, res) => {
  try {
    const option = await Option.findByIdAndDelete(req.params.id);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }
    
    // Check if any users are using this option
    const usersUsingOption = await User.findOne({ 
      $or: [
        { honor: option.value },
        { level: option.value },
        { department: option.value },
        { party: option.value },
        { group: option.value }
      ]
    });
    
    if (usersUsingOption) {
      return res.status(400).json({ 
        message: 'Cannot delete option as it is being used by users' 
      });
    }
    
    res.json({ message: 'Option deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting option' });
  }
});

module.exports = router;