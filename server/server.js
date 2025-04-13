import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import exercisesRouter from './routes/exercises.js';
import usersRouter from './routes/users.js';

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// ES Modules equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://mern-exercise-tracker-production-cdae.up.railway.app',
  'https://*.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow all subdomains of railway.app and localhost
    if (!origin || origin.endsWith('.railway.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error("MongoDB connection URI is missing. Please set ATLAS_URI environment variable.");
  process.exit(1);
}

mongoose.connect(uri, {
  dbName: 'exercise-tracker',
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Routes
app.use('/api/exercises', exercisesRouter);
app.use('/api/users', usersRouter);

// Production setup
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');
  
  // Serve static assets from client folder
  app.use(express.static(clientPath));
  
  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});