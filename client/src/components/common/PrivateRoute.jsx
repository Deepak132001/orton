// // client/src/components/common/PrivateRoute.jsx
// import { Navigate } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
// client/src/components/common/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user exists, show protected content
  return children;
};

export default PrivateRoute;