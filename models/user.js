import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
username: { 
      type: String, 
      required: true, 
      unique: true },
email:    { 
      type: String, 
      required: true, 
      unique: true },
password: { 
      type: String, 
      required: true },
fullName: { 
      type: String },
about:    { 
      type: String },
profileImage: { 
        type: String }, // path gambar
      
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
