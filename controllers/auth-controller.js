import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import PasswordResetToken from '../models/passwordResstToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' });
    }

    // Hapus token lama
    await PasswordResetToken.deleteMany({ email });
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000; // 1 jam

    await new PasswordResetToken({
      email,
      token,
      expiration,
    }).save();

    // user.resetToken = token;
    // user.resetTokenExpiration = expiration;
    // await user.save();

    // Kirim email (gunakan konfigurasi transporter Anda sendiri)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `https://nutrivision-brown.vercel.app//reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Reset Password',
      html: ` <p>Hai,</p>
              <p>Kami menerima permintaan untuk mereset password akun Anda di <strong>Nutrivision</strong>.</p>
              <p>Klik link di bawah ini untuk melanjutkan:</p>
              <p><a href="${resetURL}">${resetURL}</a></p>
              <p>Abaikan email ini jika Anda tidak meminta reset password.</p>
              <p>Terima kasih!</p>`,
    });
    
    res.json({ msg: 'Link reset password telah dikirim ke email Anda' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetToken = await PasswordResetToken.findOne({
      token,
    });

    if (!resetToken) {
      return res.status(400).json({ msg: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    const user = await User.findOne({ email: resetToken.email });
    if (!user) {
      return res.status(400).json({ msg: 'User tidak ditemukan' });
    }
    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    res.json({ msg: 'Password berhasil direset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};
