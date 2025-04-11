import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// GET single exercise
router.route('/:id').get(async (req, res) => {
  try {
    const exercise = await mongoose.connection.db
      .collection('exercises')
      .findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({
      _id: exercise._id,
      username: exercise.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
      createdAt: exercise.createdAt
    });
  } catch (err) {
    console.error('Error fetching exercise:', err);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// UPDATE exercise
router.route('/update/:id').post(async (req, res) => {
  try {
    if (!req.body.username || !req.body.description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedExercise = {
      username: req.body.username,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: new Date(req.body.date),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.db
      .collection('exercises')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $set: updatedExercise }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Exercise not found or not modified' });
    }

    res.json({
      message: 'Exercise updated successfully',
      exercise: updatedExercise
    });
  } catch (err) {
    console.error('Error updating exercise:', err);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// GET all exercises
router.route('/').get(async (req, res) => {
  try {
    const exercises = await mongoose.connection.db
      .collection('exercises')
      .find()
      .sort({ date: -1 })
      .toArray();
    
    res.json(exercises.map(ex => ({
      _id: ex._id,
      username: ex.username,
      description: ex.description,
      duration: ex.duration,
      date: ex.date ? new Date(ex.date).toISOString().split('T')[0] : null
    })));
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// POST create exercise
router.route('/').post(async (req, res) => {
  try {
    if (!req.body.username || !req.body.description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newExercise = {
      username: req.body.username,
      description: req.body.description,
      duration: Number(req.body.duration) || 0,
      date: new Date(req.body.date) || new Date(),
      createdAt: new Date()
    };

    const result = await mongoose.connection.db
      .collection('exercises')
      .insertOne(newExercise);

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise: {
        ...newExercise,
        _id: result.insertedId
      }
    });
  } catch (err) {
    console.error('Error creating exercise:', err);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// DELETE exercise
router.route('/:id').delete(async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection('exercises')
      .deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('Error deleting exercise:', err);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

export default router;