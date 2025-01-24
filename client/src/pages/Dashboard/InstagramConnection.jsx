// client/src/pages/Dashboard/InstagramConnection.jsx

import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  Instagram,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Youtube,
} from "lucide-react";
import * as instagramService from "../../services/instagram.service";


const SetupGuide = () => {
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        How to Connect Instagram Business Account
      </h3>
      
      <div className="space-y-6">
        {/* Convert Personal to Business Account */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">
            1. Convert to Business Account
          </h4>
          <div className="ml-4 space-y-2 text-sm text-gray-600">
            <p>a. Open Instagram app and go to your profile</p>
            <p>b. Tap Menu (≡) `{'>'}` Settings and privacy</p>
            <p>c. Select 'Account'</p>
            <p>d. Tap 'Switch to Professional Account'</p>
            <p>e. Choose 'Business' as your account type</p>
          </div>
        </div>

        {/* Create Facebook Page */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">
            2. Create a Facebook Page
          </h4>
          <div className="ml-4 space-y-2 text-sm text-gray-600">
            <p>a. Go to Facebook and create a new Page</p>
            <p>b. Choose a Page name related to your Instagram account</p>
            <p>c. Select a business category</p>
            <p>d. Add a profile picture and cover photo</p>
          </div>
        </div>

        {/* Connect Facebook to Instagram */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">
            3. Connect Instagram to Facebook Page
          </h4>
          <div className="ml-4 space-y-2 text-sm text-gray-600">
            <p>a. Go to your Instagram profile</p>
            <p>b. Select 'Edit Profile'</p>
            <p>c. Under 'Public Business Information', select 'Page'</p>
            <p>d. Tap 'Continue' in the 'Connect or Create Facebook Page' popup</p>
            <p>e. Log in to Facebook and choose your Page from the available options</p>
            <p>f. Tap 'Connect' after selecting a Page or 'Create' after making a new Page</p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium text-gray-800 mb-3">
            Need More Help?
          </h4>
          <div className="space-y-3">
            <a 
              href="https://www.facebook.com/business/help/898752960195806" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <Youtube className="h-4 w-4 mr-2" />
              Watch Tutorial: How to Set Up Instagram Business Account
            </a>
          </div>
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

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
      // console.log("Connection status error:", {
      //   message: error.response?.data?.message,
      //   details: error.response?.data?.details,
      // });

      setStatus({
        loading: false,
        connected: false,
        error: error.response?.data?.message || "Not connected to Instagram",
        details: error.response?.data?.details,
      });
    }
  };

  // const handleInstagramConnect = () => {
  //   setStatus((prev) => ({ ...prev, loading: true, error: null }));

  //   window.FB.init({
  //     appId: import.meta.env.VITE_FACEBOOK_APP_ID,
  //     cookie: true,
  //     xfbml: true,
  //     version: "v18.0",
  //   });

  //   // Regular function for FB.login callback
  //   window.FB.login(
  //     function (response) {
  //       if (response.status === "connected") {
  //         // Regular promise handling
  //         instagramService
  //           .connectInstagramAccount(response.authResponse.accessToken)
  //           .then((result) => {
  //             // console.log("Connection result:", result);
  //             setStatus({
  //               loading: false,
  //               connected: true,
  //               error: null,
  //               details: result,
  //             });
  //             // Show success state briefly before reload
  //             setTimeout(() => {
  //               window.location.reload();
  //             }, 1000);
  //           })
  //           .catch((error) => {
  //             // console.error("Connection error:", error.response?.data);
  //             setStatus({
  //               loading: false,
  //               connected: false,
  //               error:
  //                 error.response?.data?.message ||
  //                 "Failed to connect Instagram account",
  //               details: error.response?.data?.details,
  //             });
  //           });
  //       } else {
  //         setStatus({
  //           loading: false,
  //           connected: false,
  //           error: "Facebook login failed",
  //           details: response,
  //         });
  //       }
  //     },
  //     {
  //       scope: ["instagram_basic",'instagram_manage_insights',"pages_show_list","pages_read_engagement",
  //       ].join(","),
  //       return_scopes: true,
  //     }
  //   );
  // };

  const handleInstagramConnect = () => {
      setIsConnecting(true);
      setError('');
    
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    
      window.FB.login((response) => {
        console.log('Login Response:', response);
        if (response.status === 'connected') {
          // Check granted permissions
          window.FB.api('/me/permissions', (permResponse) => {
            console.log('Granted permissions:', permResponse.data);
          });
          
          instagramService.connectInstagramAccount(response.authResponse.accessToken)
            .then(() => window.location.reload())
            .catch(err => {
              console.error('Connection error:', err);
              setError(err.response?.data?.message);
              setIsConnecting(false);
            });
        }
      }, {
        scope: 'pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,public_profile',
        return_scopes: true
      });
    };
 
  const handleDisconnect = () => {
    // Regular promise handling
    instagramService
      .disconnectInstagramAccount()
      .then(() => {
        setStatus({
          loading: false,
          connected: false,
          error: null,
          details: null,
        });
        window.location.reload();
      })
      .catch((error) => {
        setStatus((prev) => ({
          ...prev,
          error: "Failed to disconnect account",
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
      <h1 className="text-2xl font-bold text-gray-900">Instagram Connection</h1>

      {/* Connection Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-full ${
                status.connected ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {status.connected ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {status.connected
                  ? "Instagram Connected"
                  : "Instagram Not Connected"}
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
            Connect your Instagram Business account to access analytics,
            generate content ideas, and optimize your posting schedule.
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
              <h3 className="text-xl font-semibold">
                @{status.details.username}
              </h3>
              <p className="text-gray-600">
                {status.details.followers_count?.toLocaleString()} followers •{" "}
                {status.details.media_count?.toLocaleString()} posts
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

      <SetupGuide />
    </div>
  );
};

export default InstagramConnection;
