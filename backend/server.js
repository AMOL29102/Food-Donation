import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import consumerRoutes from './routes/consumerRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // <-- Make sure this is imported
import userRoutes from './routes/userRoutes.js'; // Import user routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); // <-- Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));

// export default app;