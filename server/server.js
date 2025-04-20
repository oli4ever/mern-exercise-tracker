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
mongoose.set('debug', true);

// Initialize app
const app = express();
const port = process.env.PORT || 5000; // Changed to 5000 to match your error

// ES Modules equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced CORS configuration
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

console.log('Current Node.js version:', process.version);
console.log('Mongoose version:', mongoose.version);

// Database connection setup
async function connectToDatabase() {
  const uri = process.env.ATLAS_URI;
  if (!uri) {
    console.error("❌ MongoDB connection URI is missing");
    process.exit(1);
  }
  
  try {
    console.log("🔗 Connecting to MongoDB with URI:", 
      uri.replace(/\/\/[^@]+@/, '//****:****@')); // Hide password in logs
    await mongoose.connect(uri, {
      dbName: 'exercise-tracker',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      authSource: 'admin'
    });

    console.log("✅ MongoDB connected successfully to database:", 
      mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error("- Error:", err.name);
    console.error("- Code:", err.code);
    console.error("- Message:", err.message);
    
    // Specific troubleshooting for auth failures
    if (err.code === 8000) { // AtlasError
      console.log("\n🔧 Possible solutions:");
      console.log("1. Verify password is URL encoded (replace special characters)");
      console.log("2. Check if password contains !, @, or other special characters");
      console.log("3. Try wrapping connection string in single quotes");
    }
    
    process.exit(1);
  }
}

// API Routes (must come before static file serving)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    dbState: mongoose.connection?.readyState || 0
  });
});

app.get('/ping', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ 
      status: 'OK', 
      dbState: mongoose.connection.readyState 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'DB connection failed', 
      details: err.message 
    });
  }
});

app.use('/api/exercises', exercisesRouter);
app.use('/api/users', usersRouter);

// Production setup
if (process.env.NODE_ENV === 'production') {
  const possiblePaths = [
    path.join(__dirname, '../../client/dist'),
    path.join(__dirname, '../client/dist'),
    path.join(process.cwd(), 'client/dist')
  ];

  let clientPath;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      clientPath = possiblePath;
      break;
    }
  }

  if (!clientPath) {
    console.error('Client build not found in any standard location');
    process.exit(1);
  }

  console.log('Serving static files from:', clientPath);
  app.use(express.static(clientPath));

  // Only handle non-API routes with React
  app.get(/^\/(?!api).*/, (req, res) => {
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

// Database connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Process error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    
    const server = app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
    
    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();