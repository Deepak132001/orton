// // src/pages/Dashboard/YouTubeCallback.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Card } from '@/components/ui/card';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import * as youtubeService from '../../services/youtube.service';

// const YouTubeCallback = () => {
//   const [status, setStatus] = useState('connecting');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         const urlParams = new URLSearchParams(location.search);
//         const code = urlParams.get('code');
        
//         if (!code) {
//           throw new Error('No authorization code received');
//         }

//         console.log('Processing YouTube callback...');
//         const response = await youtubeService.connectYouTubeChannel(code);
//         console.log('YouTube connection successful:', response);

//         setStatus('success');
//         setTimeout(() => {
//           navigate('/dashboard/youtube-scripts');
//         }, 2000);
//       } catch (err) {
//         console.error('YouTube connection error:', err);
//         setStatus('error');
//         setError(err.response?.data?.message || err.message || 'Failed to connect YouTube account');
//       }
//     };

//     handleCallback();
//   }, [location, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="max-w-md w-full space-y-8 p-6 text-center">
//         {status === 'connecting' && (
//           <>
//             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
//             <h2 className="mt-4 text-lg font-medium text-gray-900">
//               Connecting your YouTube account...
//             </h2>
//           </>
//         )}

//         {status === 'success' && (
//           <>
//             <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
//             <h2 className="mt-4 text-lg font-medium text-gray-900">
//               YouTube account connected successfully!
//             </h2>
//             <p className="mt-2 text-sm text-gray-500">
//               Redirecting to dashboard...
//             </p>
//           </>
//         )}

//         {status === 'error' && (
//           <>
//             <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//             <h2 className="mt-4 text-lg font-medium text-gray-900">
//               Connection failed
//             </h2>
//             {error && (
//               <p className="mt-2 text-sm text-red-600">{error}</p>
//             )}
//             <button
//               onClick={() => navigate('/dashboard/youtube-connection')}
//               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//             >
//               Try Again
//             </button>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default YouTubeCallback;

//src/pages/Dashboard/YouTubeCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';
import { usePlatform } from '../../contexts/PlatformContext'; // Add this import

const YouTubeCallback = () => {
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { switchPlatform } = usePlatform(); // Add this

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        console.log('Processing YouTube callback...');
        const response = await youtubeService.connectYouTubeChannel(code);
        console.log('YouTube connection successful:', response);

        setStatus('success');
        
        // Ensure platform is set to YouTube
        switchPlatform('youtube');
        
        // Short delay before navigation
        setTimeout(() => {
          navigate('/dashboard/youtube-analytics');
        }, 2000);
      } catch (err) {
        console.error('YouTube connection error:', err);
        setStatus('error');
        setError(err.response?.data?.message || err.message || 'Failed to connect YouTube account');
      }
    };

    handleCallback();
  }, [location, navigate, switchPlatform]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6 text-center">
        {status === 'connecting' && (
          <>
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Connecting your YouTube account...
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              YouTube account connected successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to YouTube analytics...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Connection failed
            </h2>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              onClick={() => navigate('/dashboard/youtube-connection')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Try Again
            </button>
          </>
        )}
      </Card>
    </div>
  );
};

export default YouTubeCallback;