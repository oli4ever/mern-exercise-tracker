import fs from 'fs';
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
const port = process.env.PORT || 8080;

// ES Modules equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mern-exercise-tracker-production-cdae.up.railway.app',
    'https://*.railway.app'
  ],
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Production setup
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../client/dist');

  console.log('Production mode - looking for client build at:', clientPath);
  
  // Verify build exists
  if (!fs.existsSync(clientPath)) {
    console.error('Client build not found at:', clientPath);
    console.log('Attempting to build client...');
    try {
      const { execSync } = require('child_process');
      execSync('cd ../../client && npm run build', { stdio: 'inherit' });
    } catch (buildError) {
      console.error('Client build failed:', buildError);
    }
  }
  
  app.use(express.static(clientPath));
  
  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

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

if (!process.env.ATLAS_URI) {
  console.error("MongoDB connection URI is missing. Checking Railway variables...");
  
  // Try alternative ways to get the URI
  process.env.ATLAS_URI = process.env.RAILWAY_ENVIRONMENT === 'production' 
    ? process.env.MONGO_URL 
    : 'mongodb://localhost:27017/exercise-tracker';
  
  if (!process.env.ATLAS_URI) {
    console.error("FATAL: No MongoDB connection URI found");
    process.exit(1);
  }
}

console.log("Connecting to MongoDB with URI:", process.env.ATLAS_URI.replace(/\/\/[^@]+@/, '//****:****@'));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to:', mongoose.connection.db.databaseName);
});

// Add ping route to test DB connection
app.get('/ping', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'OK', dbState: mongoose.connection.readyState });
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed', details: err.message });
  }
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});