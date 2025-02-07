// // client/src/pages/Dashboard/InstagramConnection.jsx

// import { useState, useEffect } from "react";
// import { Card } from "../../components/ui/card";
// import {
//   Instagram,
//   CheckCircle2,
//   AlertCircle,
//   RefreshCw,
//   LogOut,
//   Youtube,
// } from "lucide-react";
// import axios from 'axios';
// import * as instagramService from "../../services/instagram.service";


// const SetupGuide = () => {
//   return (
//     <Card className="p-6 mt-6">
//       <h3 className="text-lg font-medium text-gray-900 mb-4">
//         How to Connect Instagram Business Account
//       </h3>
      
//       <div className="space-y-6">
//         {/* Convert Personal to Business Account */}
//         <div className="space-y-3">
//           <h4 className="font-medium text-gray-800">
//             1. Convert to Business Account
//           </h4>
//           <div className="ml-4 space-y-2 text-sm text-gray-600">
//             <p>a. Open Instagram app and go to your profile</p>
//             <p>b. Tap Menu (≡) `{'>'}` Settings and privacy</p>
//             <p>c. Select 'Account'</p>
//             <p>d. Tap 'Switch to Professional Account'</p>
//             <p>e. Choose 'Business' as your account type</p>
//           </div>
//         </div>

//         {/* Create Facebook Page */}
//         <div className="space-y-3">
//           <h4 className="font-medium text-gray-800">
//             2. Create a Facebook Page
//           </h4>
//           <div className="ml-4 space-y-2 text-sm text-gray-600">
//             <p>a. Go to Facebook and create a new Page</p>
//             <p>b. Choose a Page name related to your Instagram account</p>
//             <p>c. Select a business category</p>
//             <p>d. Add a profile picture and cover photo</p>
//           </div>
//         </div>

//         {/* Connect Facebook to Instagram */}
//         <div className="space-y-3">
//           <h4 className="font-medium text-gray-800">
//             3. Connect Instagram to Facebook Page
//           </h4>
//           <div className="ml-4 space-y-2 text-sm text-gray-600">
//             <p>a. Go to your Instagram profile</p>
//             <p>b. Select 'Edit Profile'</p>
//             <p>c. Under 'Public Business Information', select 'Page'</p>
//             <p>d. Tap 'Continue' in the 'Connect or Create Facebook Page' popup</p>
//             <p>e. Log in to Facebook and choose your Page from the available options</p>
//             <p>f. Tap 'Connect' after selecting a Page or 'Create' after making a new Page</p>
//           </div>
//         </div>

//         {/* Additional Resources */}
//         <div className="mt-6 border-t pt-6">
//           <h4 className="font-medium text-gray-800 mb-3">
//             Need More Help?
//           </h4>
//           <div className="space-y-3">
//             <a 
//               href="https://www.youtube.com/watch?v=1iqtvuWUeXw" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
//             >
//               <Youtube className="h-4 w-4 mr-2" />
//               Watch Tutorial: How to Set Up Instagram Business Account
//             </a>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// const InstagramConnection = () => {
//   const [status, setStatus] = useState({
//     loading: true,
//     connected: false,
//     error: null,
//     details: null,
//   });
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState('');

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
//         details: data,
//       });
//     } catch (error) {
//       // console.log("Connection status error:", {
//       //   message: error.response?.data?.message,
//       //   details: error.response?.data?.details,
//       // });

//       setStatus({
//         loading: false,
//         connected: false,
//         error: error.response?.data?.message || "Not connected to Instagram",
//         details: error.response?.data?.details,
//       });
//     }
//   };

//   const handleInstagramConnect = () => {
//     setStatus((prev) => ({ ...prev, loading: true, error: null }));

//     window.FB.init({
//       appId: import.meta.env.VITE_FACEBOOK_APP_ID,
//       cookie: true,
//       xfbml: true,
//       version: "v21.0",
//     });

//     // Regular function for FB.login callback
//     window.FB.login(
//       function (response) {
//         if (response.status === "connected") {
//           // Regular promise handling
//           instagramService
//             .connectInstagramAccount(response.authResponse.accessToken)
//             .then((result) => {
//               console.log("Connection result:", result);
//               setStatus({
//                 loading: false,
//                 connected: true,
//                 error: null,
//                 details: result,
//               });
//               // Show success state briefly before reload
//               setTimeout(() => {
//                 window.location.reload();
//               }, 1000);
//             })
//             .catch((error) => {
//               console.error("Connection error:", error.response?.data);
//               setStatus({
//                 loading: false,
//                 connected: false,
//                 error:
//                   error.response?.data?.message ||
//                   "Failed to connect Instagram account",
//                 details: error.response?.data?.details,
//               });
//             });
//         } else {
//           setStatus({
//             loading: false,
//             connected: false,
//             error: "Facebook login failed",
//             details: response,
//           });
//         }
//       },
//       {
//         scope: [
//           "instagram_basic",
//           "instagram_manage_insights",
//           "pages_show_list",
//           "pages_read_engagement", 
//           "business_management",

//         ],
//         return_scopes: true,
//       }
//     );
//   };

//   const handleDisconnect = () => {
//     // Regular promise handling
//     instagramService
//       .disconnectInstagramAccount()
//       .then(() => {
//         setStatus({
//           loading: false,
//           connected: false,
//           error: null,
//           details: null,
//         });
//         window.location.reload();
//       })
//       .catch((error) => {
//         setStatus((prev) => ({
//           ...prev,
//           error: "Failed to disconnect account",
//         }));
//       });
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
//       <h1 className="text-2xl font-bold text-gray-900">Instagram Connection</h1>

//       {/* Connection Status Card */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div
//               className={`p-2 rounded-full ${
//                 status.connected ? "bg-green-100" : "bg-yellow-100"
//               }`}
//             >
//               {status.connected ? (
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               ) : (
//                 <AlertCircle className="w-6 h-6 text-yellow-600" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-medium text-gray-900">
//                 {status.connected
//                   ? "Instagram Connected"
//                   : "Instagram Not Connected"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {status.connected
//                   ? `Connected as @${status.details.username}`
//                   : "Connect your Instagram Business account to get started"}
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
//       {!status.connected ? (
//         <Card className="p-6 text-center">
//           <Instagram className="w-16 h-16 text-pink-600 mx-auto" />
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             Connect Your Instagram Account
//           </h3>
//           <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
//             Connect your Instagram Business account to access analytics,
//             generate content ideas, and optimize your posting schedule.
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
//       ) : (
//         <Card className="p-6">
//           <div className="space-y-4">
//             {status.details.profile_picture_url && (
//               <img
//                 src={status.details.profile_picture_url}
//                 alt={status.details.username}
//                 className="w-16 h-16 rounded-full"
//               />
//             )}
//             <div>
//               <h3 className="text-xl font-semibold">
//                 @{status.details.username}
//               </h3>
//               <p className="text-gray-600">
//                 {status.details.followers_count?.toLocaleString()} followers •{" "}
//                 {status.details.media_count?.toLocaleString()} posts
//               </p>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Requirements Card */}
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

//       <SetupGuide />
//     </div>
//   );
// };

// export default InstagramConnection;

import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  Instagram,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Youtube,
  ArrowRight,
  Menu,
} from "lucide-react";
import * as instagramService from "../../services/instagram.service";

const SetupGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      title: "Convert to Business Account",
      icon: "💼",
      content: [
        "Open Instagram app and go to your profile",
        "Tap Menu (≡) > Settings and privacy",
        "Select 'Account'",
        "Tap 'Switch to Professional Account'",
        "Choose 'Business' as your account type"
      ]
    },
    {
      title: "Create a Facebook Page",
      icon: "📱",
      content: [
        "Go to Facebook and create a new Page",
        "Choose a Page name related to your Instagram account",
        "Select a business category",
        "Add a profile picture and cover photo"
      ]
    },
    {
      title: "Connect Instagram to Facebook Page",
      icon: "🔗",
      content: [
        "Go to your Instagram profile",
        "Select 'Edit Profile'",
        "Under 'Public Business Information', select 'Page'",
        "Tap 'Continue' in the 'Connect or Create Facebook Page' popup",
        "Choose your Page from the available options",
        "Tap 'Connect' after selecting a Page"
      ]
    }
  ];

  return (
    <Card className="p-4 sm:p-6 mt-6 overflow-hidden">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
        How to Connect Instagram Business Account
      </h3>
      
      <div className="space-y-6 sm:space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`transform transition-all duration-500 ${
              activeStep === index ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div className="flex items-start space-x-3 sm:space-x-4 cursor-pointer">
              <div className="text-2xl sm:text-3xl pt-1">{step.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-base sm:text-lg">
                  {index + 1}. {step.title}
                </h4>
                <div className={`mt-3 space-y-2 transition-all duration-300 ${
                  activeStep === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  {step.content.map((item, i) => (
                    <p key={i} className="text-sm sm:text-base text-gray-600 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 sm:mt-8 border-t pt-6">
          <h4 className="font-medium text-gray-800 mb-4">
            Need More Help?
          </h4>
          <a 
            href="https://www.youtube.com/watch?v=1iqtvuWUeXw" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
          >
            <Youtube className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Watch Tutorial: How to Set Up Instagram Business Account</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

const InstagramConnection = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    error: null,
    details: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        details: data,
      });
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        error: error.response?.data?.message || "Not connected to Instagram",
        details: error.response?.data?.details,
      });
    }
  };

  const handleInstagramConnect = () => {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: "v21.0",
    });

    window.FB.login(
      function (response) {
        if (response.status === "connected") {
          instagramService
            .connectInstagramAccount(response.authResponse.accessToken)
            .then((result) => {
              setStatus({
                loading: false,
                connected: true,
                error: null,
                details: result,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
            .catch((error) => {
              setStatus({
                loading: false,
                connected: false,
                error: error.response?.data?.message || "Failed to connect Instagram account",
                details: error.response?.data?.details,
              });
            });
        } else {
          setStatus({
            loading: false,
            connected: false,
            error: "Facebook login failed",
            details: response,
          });
        }
      },
      {
        scope: [
          "instagram_basic",
          "instagram_manage_insights",
          "pages_show_list",
          "pages_read_engagement",
          "business_management",
        ],
        return_scopes: true,
      }
    );
  };

  const handleDisconnect = async () => {
    try {
      await instagramService.disconnectInstagramAccount();
      setStatus({
        loading: false,
        connected: false,
        error: null,
        details: null,
      });
      window.location.reload();
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: "Failed to disconnect account",
      }));
    }
  };

  if (status.loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="relative">
          <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-indigo-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Instagram Connection
      </h1>

      <Card className="p-4 sm:p-6 transform transition-all duration-500 hover:shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 sm:p-3 rounded-full transform transition-all duration-500 ${
                status.connected 
                  ? "bg-green-100 rotate-0" 
                  : "bg-yellow-100 rotate-12"
              }`}
            >
              {status.connected ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 animate-pulse" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {status.connected ? "Instagram Connected" : "Instagram Not Connected"}
              </h2>
              <p className="text-sm text-gray-500">
                {status.connected
                  ? `Connected as @${status.details.username}`
                  : "Connect your Instagram Business account to get started"}
              </p>
            </div>
          </div>
          {status.connected && (
            <button
              onClick={handleDisconnect}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300 hover:border-red-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          )}
        </div>
      </Card>

      {!status.connected ? (
        <Card className="p-6 sm:p-8 text-center transform transition-all duration-500 hover:shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
            <Instagram className="w-16 h-16 sm:w-20 sm:h-20 text-pink-600 mx-auto relative animate-bounce" />
          </div>
          <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900">
            Connect Your Instagram Account
          </h3>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Connect your Instagram Business account to access analytics,
            generate content ideas, and optimize your posting schedule.
          </p>
          {status.error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 animate-shake">
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
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
          <div className="mt-4 text-xs sm:text-sm text-gray-500">
            Make sure you have an Instagram Business account and Facebook Page
          </div>
        </Card>
      ) : (
        <Card className="p-4 sm:p-6 transform transition-all duration-500 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {status.details.profile_picture_url && (
                <img
                  src={status.details.profile_picture_url}
                  alt={status.details.username}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-purple-100 animate-pulse"
                />
              )}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  @{status.details.username}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {status.details.followers_count?.toLocaleString()} followers •{" "}
                  {status.details.media_count?.toLocaleString()} posts
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-6 transform transition-all duration-500 hover:shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
          Connection Requirements
        </h3>
        <ul className="space-y-4">
          {[
            "Instagram Business or Creator Account",
            "Connected Facebook Page",
            "Admin access to the Facebook Page"
          ].map((requirement, index) => (
            <li 
              key={index}
              className="flex items-center transform transition-all duration-300 hover:translate-x-2"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600">{requirement}</span>
            </li>
          ))}
        </ul>
      </Card>

      <SetupGuide />
    </div>
  );
};

export default InstagramConnection;