// // client/src/pages/Dashboard/InstagramConnection.jsx
// import { useState, useEffect } from 'react';
// import { Card } from '../../components/ui/card';
// import { Instagram, CheckCircle2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
// import * as instagramService from '../../services/instagram.service';
// import { useNavigate } from 'react-router-dom';

// const InstagramConnection = () => {
//   const [status, setStatus] = useState({
//     loading: true,
//     connected: false,
//     error: null,
//     details: null
//   });

//   useEffect(() => {
//     checkConnectionStatus();
//   }, []);

//   const checkConnectionStatus = async () => {
//     try {
//       const data = await instagramService.getInstagramProfile();
//       setStatus({
//         loading: false,
//         connected: true,
//         error: null,
//         details: data
//       });
//     } catch (error) {
//       console.log('Connection status error:', {
//         message: error.response?.data?.message,
//         details: error.response?.data?.details
//       });
      
//       setStatus({
//         loading: false,
//         connected: false,
//         error: error.response?.data?.message || 'Not connected to Instagram',
//         details: error.response?.data?.details
//       });
//     }
//   };


//   const handleInstagramConnect = () => {
//     setStatus(prev => ({ ...prev, loading: true, error: null }));
    
//     window.FB.init({
//       appId: import.meta.env.VITE_FACEBOOK_APP_ID,
//       cookie: true,
//       xfbml: true,
//       version: 'v18.0'
//     });

//     window.FB.login(handleFacebookResponse, {
//       scope: [
//         'instagram_basic',
//         'instagram_content_publish',
//         'instagram_manage_insights',
//         'pages_show_list',
//         'pages_read_engagement',
//         'pages_manage_metadata',
//         'business_management',
//         'public_profile'
//       ].join(','),
//       return_scopes: true
//     });
//   };


//   const handleFacebookResponse = (response) => {
//     console.log('FB Login response:', response);
    
//     if (response.status === 'connected') {
//       // Debug: Get granted permissions
//       window.FB.api(
//         '/me/permissions',
//         { access_token: response.authResponse.accessToken },
//         (permissionsResponse) => {
//           console.log('Granted permissions:', permissionsResponse);
//         }
//       );

//       // Debug: Get pages directly from Facebook
//       window.FB.api(
//         '/me/accounts',
//         { access_token: response.authResponse.accessToken },
//         (pagesResponse) => {
//           console.log('Facebook pages response:', pagesResponse);
//         }
//       );

//       connectInstagramAccount(response.authResponse.accessToken);
//     } else {
//       setStatus({
//         loading: false,
//         connected: false,
//         error: 'Facebook login failed',
//         details: response
//       });
//     }
//   };


//   const connectInstagramAccount = async (accessToken) => {
//     try {
//       const result = await instagramService.connectInstagramAccount(accessToken);
//       console.log('Connection result:', result);
//       await checkConnectionStatus();
//     } catch (error) {
//       console.error('Connection error:', error.response?.data);
//       setStatus({
//         loading: false,
//         connected: false,
//         error: error.response?.data?.message || 'Failed to connect Instagram account',
//         details: error.response?.data?.details
//       });
//     }
//   };

//   const handleDisconnect = async () => {
//     try {
//       await instagramService.disconnectInstagramAccount();
//       setStatus({
//         loading: false,
//         connected: false,
//         error: null,
//         details: null
//       });
//     } catch (error) {
//       setStatus(prev => ({
//         ...prev,
//         error: 'Failed to disconnect account'
//       }));
//     }
//   };

//   if (status.loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900">
//         Instagram Connection
//       </h1>

//       {/* Connection Status Card */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className={`p-2 rounded-full ${status.connected ? 'bg-green-100' : 'bg-yellow-100'}`}>
//               {status.connected ? (
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               ) : (
//                 <AlertCircle className="w-6 h-6 text-yellow-600" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-medium text-gray-900">
//                 {status.connected ? 'Instagram Connected' : 'Instagram Not Connected'}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {status.connected 
//                   ? `Connected as @${status.details.username}`
//                   : 'Connect your Instagram Business account to get started'
//                 }
//               </p>
//             </div>
//           </div>
//           {status.connected && (
//             <button
//               onClick={handleDisconnect}
//               className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Disconnect
//             </button>
//           )}
//         </div>
//       </Card>

//       {/* Connection Button or Account Details */}
//       {status.connected ? (
//         <Card className="p-6">
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               {status.details.profile_picture_url && (
//                 <img
//                   src={status.details.profile_picture_url}
//                   alt={status.details.username}
//                   className="w-16 h-16 rounded-full"
//                 />
//               )}
//               <div>
//                 <h3 className="text-xl font-semibold">@{status.details.username}</h3>
//                 <p className="text-gray-600">
//                   {status.details.followers_count?.toLocaleString()} followers • {status.details.media_count?.toLocaleString()} posts
//                 </p>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Account Type</p>
//                 <p className="text-lg font-medium">Business</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Connected Since</p>
//                 <p className="text-lg font-medium">
//                   {new Date().toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-500">Status</p>
//                 <p className="text-lg font-medium text-green-600">Active</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       ) : (
//         <Card className="p-6 text-center">
//           <Instagram className="w-16 h-16 text-pink-600 mx-auto" />
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             Connect Your Instagram Account
//           </h3>
//           <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
//             Connect your Instagram Business account to access analytics, generate content ideas, and optimize your posting schedule.
//           </p>
//           {status.error && (
//             <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
//               <p className="text-sm text-red-600">{status.error}</p>
//               {status.details && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {JSON.stringify(status.details)}
//                 </p>
//               )}
//             </div>
//           )}
//           <button
//             onClick={handleInstagramConnect}
//             disabled={status.loading}
//             className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//           >
//             {status.loading ? (
//               <>
//                 <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                 Connecting...
//               </>
//             ) : (
//               <>
//                 <Instagram className="w-5 h-5 mr-2" />
//                 Connect with Instagram
//               </>
//             )}
//           </button>
//           <div className="mt-4 text-xs text-gray-500">
//             Make sure you have an Instagram Business account and Facebook Page
//           </div>
//         </Card>
//       )}

//       {/* Requirements and Help */}
//       <Card className="p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Connection Requirements
//         </h3>
//         <ul className="space-y-3 text-sm text-gray-600">
//           <li className="flex items-center">
//             <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
//             Instagram Business or Creator Account
//           </li>
//           <li className="flex items-center">
//             <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
//             Connected Facebook Page
//           </li>
//           <li className="flex items-center">
//             <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
//             Admin access to the Facebook Page
//           </li>
//         </ul>
//       </Card>
//     </div>
//   );
// };

// export default InstagramConnection;


// client/src/pages/Dashboard/InstagramConnection.jsx

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Instagram, CheckCircle2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import * as instagramService from '../../services/instagram.service';
import { useNavigate } from 'react-router-dom';

const InstagramConnection = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    error: null,
    details: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const data = await instagramService.getInstagramProfile();
      setStatus({
        loading: false,
        connected: true,
        error: null,
        details: data
      });
    } catch (error) {
      console.log('Connection status error:', {
        message: error.response?.data?.message,
        details: error.response?.data?.details
      });
      
      setStatus({
        loading: false,
        connected: false,
        error: error.response?.data?.message || 'Not connected to Instagram',
        details: error.response?.data?.details
      });
    }
  };

  const handleInstagramConnect = () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });

    // Regular function for FB.login callback
    window.FB.login(function(response) {
      if (response.status === 'connected') {
        // Regular promise handling
        instagramService.connectInstagramAccount(response.authResponse.accessToken)
          .then(result => {
            console.log('Connection result:', result);
            setStatus({
              loading: false,
              connected: true,
              error: null,
              details: result
            });
            // Show success state briefly before reload
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch(error => {
            console.error('Connection error:', error.response?.data);
            setStatus({
              loading: false,
              connected: false,
              error: error.response?.data?.message || 'Failed to connect Instagram account',
              details: error.response?.data?.details
            });
          });
      } else {
        setStatus({
          loading: false,
          connected: false,
          error: 'Facebook login failed',
          details: response
        });
      }
    }, {
      scope: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_metadata',
        'business_management',
        'public_profile'
      ].join(','),
      return_scopes: true
    });
  };

  const handleDisconnect = () => {
    // Regular promise handling
    instagramService.disconnectInstagramAccount()
      .then(() => {
        setStatus({
          loading: false,
          connected: false,
          error: null,
          details: null
        });
        window.location.reload();
      })
      .catch(error => {
        setStatus(prev => ({
          ...prev,
          error: 'Failed to disconnect account'
        }));
      });
  };

  if (status.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Instagram Connection
      </h1>

      {/* Connection Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${status.connected ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {status.connected ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {status.connected ? 'Instagram Connected' : 'Instagram Not Connected'}
              </h2>
              <p className="text-sm text-gray-500">
                {status.connected 
                  ? `Connected as @${status.details.username}`
                  : 'Connect your Instagram Business account to get started'
                }
              </p>
            </div>
          </div>
          {status.connected && (
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          )}
        </div>
      </Card>

      {/* Connection Button or Account Details */}
      {!status.connected ? (
        <Card className="p-6 text-center">
          <Instagram className="w-16 h-16 text-pink-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Connect Your Instagram Account
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Connect your Instagram Business account to access analytics, generate content ideas, and optimize your posting schedule.
          </p>
          {status.error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{status.error}</p>
              {status.details && (
                <p className="text-xs text-red-500 mt-1">
                  {JSON.stringify(status.details)}
                </p>
              )}
            </div>
          )}
          <button
            onClick={handleInstagramConnect}
            disabled={status.loading}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {status.loading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Connecting...
              </>
            ) : (
              <>
                <Instagram className="w-5 h-5 mr-2" />
                Connect with Instagram
              </>
            )}
          </button>
          <div className="mt-4 text-xs text-gray-500">
            Make sure you have an Instagram Business account and Facebook Page
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            {status.details.profile_picture_url && (
              <img
                src={status.details.profile_picture_url}
                alt={status.details.username}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">@{status.details.username}</h3>
              <p className="text-gray-600">
                {status.details.followers_count?.toLocaleString()} followers • {status.details.media_count?.toLocaleString()} posts
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Requirements Card */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Connection Requirements
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Instagram Business or Creator Account
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Connected Facebook Page
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Admin access to the Facebook Page
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default InstagramConnection;