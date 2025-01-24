// // client/src/components/instagram/ConnectInstagram.jsx
// import { useState } from 'react';
// import { Card } from '../../components/ui/card';
// import { Instagram } from 'lucide-react';
// import * as instagramService from '../../services/instagram.service';

// const ConnectInstagram = () => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState('');

//   const handleInstagramConnect = () => {
//     window.FB.init({
//       appId: import.meta.env.VITE_FACEBOOK_APP_ID,
//       cookie: true,
//       xfbml: true,
//       version: 'v18.0'
//     });
  
//     window.FB.getLoginStatus(function(response) {
//       console.log('Login status response:', response);
      
//       if (response.status === 'connected') {
//         connectInstagramAccount(response.authResponse.accessToken);
//       } else {
//         window.FB.login(
//           function(loginResponse) {
//             console.log('FB.login response:', loginResponse);
            
//             if (loginResponse.status === 'connected') {
//               connectInstagramAccount(loginResponse.authResponse.accessToken);
//             } else {
//               console.error('Facebook login failed:', loginResponse);
//               setError('Failed to connect with Facebook');
//             }
//           },
//           {
//             scope: 'instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement',
//             return_scopes: true,
//             enable_profile_selector: true
//           }
//         );
//       }
//     });
//   };

//   const connectInstagramAccount = async (accessToken) => {
//     setIsConnecting(true);
//     try {
//       await instagramService.connectInstagramAccount(accessToken);
//       window.location.reload(); // Refresh to show dashboard
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to connect Instagram account');
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <Instagram className="w-16 h-16 text-pink-600" />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Connect your Instagram Account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Connect your Instagram Business account to get started with analytics and insights
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <div className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-md p-4">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900">
//                 Requirements:
//               </h3>
//               <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//                 <li>Instagram Business or Creator Account</li>
//                 <li>Connected Facebook Page</li>
//                 <li>Admin access to the Facebook Page</li>
//               </ul>
//             </div>

//             <button
//               onClick={handleInstagramConnect}
//               disabled={isConnecting}
//               className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//             >
//               {isConnecting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Connecting...
//                 </>
//               ) : (
//                 <>
//                   <Instagram className="w-5 h-5 mr-2" />
//                   Connect with Instagram
//                 </>
//               )}
//             </button>

//             <div className="mt-4">
//               <p className="text-xs text-gray-500 text-center">
//                 By connecting your account, you agree to give this application access to your Instagram Business account data.
//               </p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ConnectInstagram;

// src/frontend/components/instagram/ConnectInstagram.jsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Instagram } from 'lucide-react';
import * as instagramService from '../../services/instagram.service';

const ConnectInstagram = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleInstagramConnect = () => {
    setIsConnecting(true);
    setError('');

    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });

    window.FB.getLoginStatus(function(response) {
      console.log('Initial status:', response);

      const handleLoginResponse = (loginResponse) => {
        console.log('Login response:', loginResponse);
        
        if (loginResponse.status === 'connected') {
          instagramService.connectInstagramAccount(loginResponse.authResponse.accessToken)
            .then(() => {
              console.log('Instagram connected successfully');
              window.location.reload();
            })
            .catch(err => {
              console.error('Connection error:', err);
              setError(err.response?.data?.message || 'Failed to connect Instagram');
              setIsConnecting(false);
            });
        } else {
          console.error('Login failed:', loginResponse);
          setError('Facebook login failed');
          setIsConnecting(false);
        }
      };

      if (response.status !== 'connected') {
        window.FB.login(handleLoginResponse, {
          scope: 'instagram_basic,instagram_manage_insights',
          return_scopes: true,
          enable_profile_selector: true
        });
      } else {
        handleLoginResponse(response);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Instagram className="w-16 h-16 text-pink-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect your Instagram Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your Instagram Business account to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleInstagramConnect}
              disabled={isConnecting}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <Instagram className="w-5 h-5 mr-2" />
                  Connect with Instagram
                </>
              )}
            </button>

            <div className="mt-4">
              <p className="text-xs text-gray-500 text-center">
                Make sure you have an Instagram Business account and Facebook Page
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConnectInstagram;