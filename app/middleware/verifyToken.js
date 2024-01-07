import jwt from "jsonwebtoken";
import CONFIG from "../utils/config.js";


const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is missing' });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) 
      return res.status(401).json({ success: false, message: 'Invalid token' });
    if (decoded && decoded.isAdmin) 
      next();
  });
};


const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token is missing' });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) 
      return res.status(401).json({ message: 'Invalid token' });
    if (decoded && decoded.isUser) 
      next();
  });
};

export { verifyAdmin, verifyUser };