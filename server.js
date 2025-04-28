const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/userRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
