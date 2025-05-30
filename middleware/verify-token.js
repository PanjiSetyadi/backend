import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Akses ditolak: token tidak ada' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user ke req.user
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ msg: 'Token tidak valid' });
  }
};
