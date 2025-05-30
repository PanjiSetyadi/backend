import User from '../models/user.js';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};
