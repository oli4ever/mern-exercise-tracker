import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// GET all users
router.route('/').get(async (req, res) => {
  try {
    const users = await mongoose.connection.db
      .collection('users')
      .find()
      .project({ username: 1 }) // Only return username field
      .toArray();
    
    if (!users.length) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(users);
  } catch (err) {
    console.error('Database error:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST - Add new user
router.route('/add').post(async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await mongoose.connection.db
      .collection('users')
      .insertOne({ username: req.body.username });

    res.status(201).json({
      message: 'User added successfully',
      id: result.insertedId
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to add user',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;