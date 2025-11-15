const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser'); // <-- 1. IMPORT cookie-parser

// Route imports
const productRoutes = require('./routes/productRoutes.js');
const authRoutes = require('./routes/authRoutes.js'); // <-- 2. IMPORT auth routes

// Load env variables
dotenv.config();

const corsOptions = {
  origin: "http://localhost:3000", // your Next.js frontend origin
  credentials: true,                // <- allow cookies to be sent/received
};

// Connect to MongoDBz
connectDB(); // <-- Use the imported function

const app = express();

// We are allowing all CORS requests
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser()); // <-- 3. USE cookie-parser (to read/write cookies)

// --- API Routes ---
// A simple test route
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Use the product routes
app.use('/api/products', productRoutes);

// Use the auth routes
app.use('/api/auth', authRoutes); // <-- 4. MOUNT auth routes

// --- Start Server ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
