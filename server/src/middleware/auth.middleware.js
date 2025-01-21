// // server/src/middleware/auth.middleware.js
// import jwt from 'jsonwebtoken';
// import { User } from '../models/user.model.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     // Get token from Authorization header and log it for debugging
//     const authHeader = req.headers.authorization;
//     console.log('Auth Header:', authHeader); // Debugging log

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         message: 'Authentication required. No token provided or invalid format.' 
//       });
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('Extracted Token:', token); // Debugging log

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded); // Debugging log

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth Error:', error); // Debugging log
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// server/src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Authentication required'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Invalid token format'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};