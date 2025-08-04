const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Option = require('../models/Option');

// Get dropdown options
router.get('/options', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const birthYears = Array.from({ length: 48 }, (_, i) => currentYear - 65 + i);
    const groups = await Option.find({ type: 'group' }).select('value -_id');
        
    const [honors, levels, departments, parties] = await Promise.all([
      Option.find({ type: 'honor' }).select('value -_id'),
      Option.find({ type: 'level' }).select('value -_id'),
      Option.find({ type: 'department' }).select('value -_id'),
      Option.find({ type: 'party' }).select('value -_id')
    ]);
    
    const options = {
      honors: honors.map(o => o.value),
      levels: levels.map(o => o.value),
      departments: departments.map(o => o.value),
      parties: parties.map(o => o.value),
      sexes: ['Male', 'Female', 'Other'],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      years: birthYears,
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      groups: groups.map(g => g.value) || ['Group 1', 'Group 2']
    };
    
    res.json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ message: 'Error fetching options' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, password, honor, name, level, department, party, sex, role, group, year, month, day } = req.body;
    
    // Validate role
    const validRoles = ['admin', 'manager', 'reporter', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Create birthday date
    const birthday = new Date(year, month - 1, day);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user with role
    const user = new User({
      username,
      password: hashedPassword,
      honor,
      name,
      level,
      department,
      party,
      sex,
      birthday,
      role, // Make sure role is included here
      group: role === 'reporter' ? group : undefined // Only set group for reporters
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        group: user.group
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
// Login route - make sure this exists
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Ensure you're using the same secret as in your .env
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your_jwt_secret', // Must match verification secret
      { expiresIn: '1h' } // Token expiration
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;