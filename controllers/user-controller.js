import User from '../models/user.js';
import fs from 'fs';
import path from 'path';


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.status(200).json({user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Terjadi kesalahan di server' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, about } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    let newProfileImage = null;

    if (req.file) {
      // Hapus foto lama jika ada
      if (user.profileImage) {
        const oldImagePath = path.join('public', user.profileImage).replace(/\\/g, '/');
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Simpan path relatif baru, tanpa "public/"
      const filePath = req.file.path.replace(/\\/g, '/'); // ganti \ ke /
      newProfileImage = filePath.replace(/^public\//, '');
    }

    // Siapkan data yang akan diupdate
    const updateData = {
      ...(fullName && { fullName }),
      ...(about && { about }),
      ...(newProfileImage && { profileImage: newProfileImage }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');

    res.status(200).json({
      msg: 'Profil berhasil diperbarui',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Gagal update profil' });
  }
};

