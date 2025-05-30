import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user-auth.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
