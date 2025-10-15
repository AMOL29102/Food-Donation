import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import consumerRoutes from './routes/consumerRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// **CRITICAL FIX**: Add JSON body parser middleware
// This line allows your server to accept and read JSON from request bodies.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/consumer', consumerRoutes);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server running on port ${PORT}`));
export default app;