const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Route middleware
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// MongoDB Connection
const CONNECTION_URL = 'mongodb://localhost:27017/absence-management';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
  // Initialize default options
  const initializeOptions = async () => {
    const Option = require('./models/Option');
    const initialOptions = [
      { type: 'honor', value: 'Mr.' },
      { type: 'honor', value: 'Mrs.' },
      { type: 'honor', value: 'Ms.' },
      { type: 'honor', value: 'Dr.' },
      { type: 'level', value: 'Intern' },
      { type: 'level', value: 'Junior' },
      { type: 'level', value: 'Mid-level' },
      { type: 'level', value: 'Senior' },
      { type: 'department', value: 'HR' },
      { type: 'department', value: 'Finance' },
      { type: 'department', value: 'IT' },
      { type: 'party', value: 'Democratic' },
      { type: 'party', value: 'Republican' },
      { type: 'party', value: 'Independent' }
    ];

    for (const option of initialOptions) {
      await Option.findOneAndUpdate(
        { type: option.type, value: option.value },
        option,
        { upsert: true, new: true }
      );
    }
    console.log('Initial options created');
  };

  initializeOptions().catch(console.error);
})
.catch((error) => console.log(error.message));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});