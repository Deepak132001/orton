// server/src/middleware/error.middleware.js

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate key error',
      error: 'A user with this email already exists'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
};

// // server/src/middleware/error.middleware.js
// export const errorHandler = (err, req, res, next) => {
//     console.error(err.stack);
  
//     if (err.name === 'ValidationError') {
//       return res.status(400).json({
//         message: 'Validation Error',
//         errors: Object.values(err.errors).map(error => error.message)
//       });
//     }
  
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         message: 'Invalid token'
//       });
//     }
  
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         message: 'Token expired'
//       });
//     }
  
//     // Default error
//     res.status(err.status || 500).json({
//       message: err.message || 'Internal Server Error'
//     });
//   };