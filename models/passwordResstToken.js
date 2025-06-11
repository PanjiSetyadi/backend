import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema);
