const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');

// Load env variables FIRST
dotenv.config();

// Route imports
const productRoutes = require('./routes/productRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const addressRoutes = require('./routes/addressRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js'); // NEW

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Connect to MongoDB
connectDB();

const app = express();

// CORS
app.use(cors(corsOptions));

// Webhook route MUST come BEFORE express.json()
app.post('/api/orders/webhook', 
  express.raw({ type: 'application/json' }),
  require('./controllers/orderController').handleRazorpayWebhook
);

// JSON parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/ai', aiRoutes); // NEW

// --- Start Server ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});