import mongoose, { Schema } from 'mongoose';

const statsSchema = new Schema(
  {
    winner: String,
    accuracy: Number,
    shots: Number,
    nickname: String,
  },
  { timestamps: true }
);

const Stats = mongoose.models.Stats || mongoose.model('Stats', statsSchema);

export default Stats;
