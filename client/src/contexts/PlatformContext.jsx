
// // src/contexts/PlatformContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as instagramService from '../services/instagram.service';
// import * as youtubeService from '../services/youtube.service';
// import useAuth from '../hooks/useAuth';

// const PlatformContext = createContext(null);

// export const PlatformProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [currentPlatform, setCurrentPlatform] = useState('instagram');
//   const [platformData, setPlatformData] = useState({
//     instagram: null,
//     youtube: null,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Only fetch platform data if user is logged in
//     if (user) {
//       fetchPlatformData();
//     }
//   }, [user]); // Only re-run when user state changes

//   const fetchPlatformData = async () => {
//     try {
//       setLoading(true);
      
//       // Only fetch if user is authenticated
//       if (user) {
//         // Fetch Instagram data
//         try {
//           const instagramData = await instagramService.getInstagramProfile();
//           setPlatformData(prev => ({ ...prev, instagram: instagramData }));
//         } catch (error) {
//           console.error('Instagram fetch error:', error);
//         }

//         // Fetch YouTube data
//         try {
//           const youtubeData = await youtubeService.getYouTubeProfile();
//           setPlatformData(prev => ({ ...prev, youtube: youtubeData }));
//         } catch (error) {
//           console.error('YouTube fetch error:', error);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching platform data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchPlatform = (platform) => {
//     setCurrentPlatform(platform);
//   };

//   const value = {
//     currentPlatform,
//     switchPlatform,
//     platformData,
//     refreshPlatformData: fetchPlatformData,
//     loading
//   };

//   return (
//     <PlatformContext.Provider value={value}>
//       {children}
//     </PlatformContext.Provider>
//   );
// };

// export const usePlatform = () => {
//   const context = useContext(PlatformContext);
//   if (!context) {
//     throw new Error('usePlatform must be used within a PlatformProvider');
//   }
//   return context;
// };

// export default PlatformContext;

// src/contexts/PlatformContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as instagramService from '../services/instagram.service';
import * as youtubeService from '../services/youtube.service';
import useAuth from '../hooks/useAuth';

const PlatformContext = createContext(null);

export const PlatformProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentPlatform, setCurrentPlatform] = useState('instagram');
  const [platformData, setPlatformData] = useState({
    instagram: null,
    youtube: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlatformData();
    } else {
      // Reset platform data when user logs out
      setPlatformData({
        instagram: null,
        youtube: null,
      });
      setLoading(false);
    }
  }, [user]);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      if (user) {
        // Fetch Instagram data
        try {
          const instagramData = await instagramService.getInstagramProfile();
          setPlatformData(prev => ({ ...prev, instagram: instagramData }));
        } catch (error) {
          // Set Instagram data to indicate not connected
          setPlatformData(prev => ({ 
            ...prev, 
            instagram: { message: 'Instagram not connected' } 
          }));
        }

        // Fetch YouTube data
        try {
          const youtubeData = await youtubeService.getYouTubeProfile();
          setPlatformData(prev => ({ ...prev, youtube: youtubeData }));
        } catch (error) {
          // Set YouTube data to indicate not connected
          setPlatformData(prev => ({ 
            ...prev, 
            youtube: { connected: false } 
          }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchPlatform = (platform) => {
    setCurrentPlatform(platform);
  };

  const value = {
    currentPlatform,
    switchPlatform,
    platformData,
    refreshPlatformData: fetchPlatformData,
    loading
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

export default PlatformContext;