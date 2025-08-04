// After mongoose connection
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