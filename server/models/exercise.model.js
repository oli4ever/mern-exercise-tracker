import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
  // Include all possible field variations
  createdAt: Date,
  updatedAt: Date,
  createAkt: Date,
  updateAkt: Date,
  __v: Number
}, {
  collection: 'exercises',
  strict: false,  // Allow extra fields
  versionKey: false // Disable version key
});

export default mongoose.model('Exercise', exerciseSchema);