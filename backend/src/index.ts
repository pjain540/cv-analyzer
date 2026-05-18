import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mainRouter from './routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://cv-analyzer-frontend-yhu0.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", mainRouter);

// Database Connection
connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});