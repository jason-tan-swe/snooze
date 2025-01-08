import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  event_type: {
    type: String,
    enum: ['create', 'update', 'delete'],
  },
  data_type: {
    type: String,
    enum: ["tag", "enhanced_tag", "workout", "session", "sleep", "daily_sleep", "daily_readiness", "daily_activity", "daily_spo2", "sleep_time", "rest_mode_period", "ring_configuration", "daily_stress"],
  },
  object_id: { type: String },
  event_time: { type: String },
  user_id: { type: String }
});

export default mongoose.models.Data || mongoose.model('Data', DataSchema);
