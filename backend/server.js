const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');

// Route imports
const productRoutes = require('./routes/productRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js'); // NEW: Import cart routes

// Load env variables
dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // NEW: Mount cart routes

// --- Start Server ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});