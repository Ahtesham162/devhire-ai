require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.send('DevHire AI API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));