const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB(); // <-- Use the imported function


const app = express();

// --- THIS IS THE FIX ---
// We are removing the specific origin check and just allowing all
// requests. This is safe for development and fixes server-to-server fetching.
app.use(cors());
// -----------------------

app.use(express.json());

// --- API Routes ---
// A simple test route
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Use the product routes
app.use('/api/products', productRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});