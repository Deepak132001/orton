// // client/src/contexts/AuthContext.jsx

// import { createContext, useContext, useState, useEffect } from 'react';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [isNewUser, setIsNewUser] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
//     // const newUser = localStorage.getItem('isNewUser');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//       // setIsNewUser(newUser === 'true');
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     setUser(userData);
//     // setIsNewUser(false);
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('isNewUser', 'false');
//   };

//   const register = (userData, token) => {
//     setUser(userData);
//     // setIsNewUser(true);
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('isNewUser', 'true');
//   };

//   const logout = () => {
//     setUser(null);
//     // setIsNewUser(false);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('isNewUser');
//   };

//   const clearNewUserFlag = () => {
//     // setIsNewUser(false);
//     localStorage.setItem('isNewUser', 'false');
//   };

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         user, 
//         login, 
//         logout, 
//         register,
//         loading,
//         // isNewUser,
//         clearNewUserFlag
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setAuthToken(token);
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const register = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 