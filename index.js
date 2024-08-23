const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/routes'); // Assuming your routes file is named userRoutes.js

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/formvalidation';

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Define your routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Node.js and MongoDB!');
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
