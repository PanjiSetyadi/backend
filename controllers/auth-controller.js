import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Cek user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: 'Registrasi berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email tidak ditemukan' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password salah' });
    }

    // Buat JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};
