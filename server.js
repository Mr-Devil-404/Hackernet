const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes
const authRoute = require('./routes/auth');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch((err) => console.log(err));

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT ${PORT}`);
});
