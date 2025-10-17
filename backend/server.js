import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Make sure cors is imported
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import consumerRoutes from './routes/consumerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ** FIX: Configure CORS to allow your deployed frontend **
const allowedOrigins = [
  'https://rescuebite-sigma.vercel.app', // Your deployed frontend
  'http://localhost:5173', // Your local development frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important for sending cookies or authorization headers
};

app.use(cors(corsOptions)); // Use the configured options
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));

export default app;