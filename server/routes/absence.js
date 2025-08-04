// routes/absence.js
const express = require('express');
const router = express.Router();
const Absence = require('../models/Absence');
const User = require('../models/User');

// Get absences for reporter's group
router.get('/group/:group', async (req, res) => {
  try {
    const { start, end } = req.query;
    const absences = await Absence.find({
      group: req.params.group,
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).populate('user', 'name');
    
    // Process data to calculate present/absent days per user
    const result = processAbsenceData(absences);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all absences for managers
router.get('/', async (req, res) => {
  try {
    const { start, end, search, group } = req.query;
    const query = {
      date: { $gte: new Date(start), $lte: new Date(end) }
    };
    
    if (group && group !== 'all') query.group = group;
    
    if (search) {
      const users = await User.find({ name: { $regex: search, $options: 'i' } });
      query.user = { $in: users.map(u => u._id) };
    }
    
    const absences = await Absence.find(query).populate('user', 'name group');
    const result = processAbsenceData(absences);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to process absence data
function processAbsenceData(absences) {
  // Group by user and calculate present/absent days
  // Returns array of { userId, name, presentDays, absentDays }
}

module.exports = router;