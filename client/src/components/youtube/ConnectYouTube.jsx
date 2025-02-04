// src/components/youtube/ConnectYouTube.jsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Youtube, AlertCircle } from 'lucide-react';

const ConnectYouTube = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // const handleConnect = () => {
  //   try {
  //     setIsConnecting(true);
  //     setError('');

  //     const clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
  //     const redirectUri = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;

  //     // Log the redirect URI for debugging
  //     console.log('Using redirect URI:', redirectUri);

  //     // Build OAuth URL
  //     const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  //     oauthUrl.searchParams.append('client_id', clientId);
  //     oauthUrl.searchParams.append('redirect_uri', redirectUri);
  //     oauthUrl.searchParams.append('response_type', 'code');
  //     oauthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly');
  //     oauthUrl.searchParams.append('access_type', 'offline');
  //     oauthUrl.searchParams.append('prompt', 'consent');

  //     // Log the complete OAuth URL for debugging
  //     console.log('OAuth URL:', oauthUrl.toString());

  //     // Redirect to OAuth URL
  //     window.location.href = oauthUrl.toString();
  //   } catch (error) {
  //     console.error('Error initiating YouTube connection:', error);
  //     setError('Failed to initiate YouTube connection');
  //     setIsConnecting(false);
  //   }
  // };
// src/components/youtube/ConnectYouTube.jsx
const handleConnect = () => {
  const clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;
  
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('youtube_oauth_state', state);

  const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  oauthUrl.searchParams.set('client_id', clientId);
  oauthUrl.searchParams.set('redirect_uri', redirectUri);
  oauthUrl.searchParams.set('response_type', 'code');
  oauthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.readonly');
  oauthUrl.searchParams.set('access_type', 'offline');
  oauthUrl.searchParams.set('state', state);
  oauthUrl.searchParams.set('prompt', 'consent');

  window.location.href = oauthUrl.toString();
};

  return (
    <Card className="p-6">
      <div className="text-center">
        <Youtube className="w-16 h-16 text-red-600 mx-auto" />
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Connect YouTube
        </h2>
        <p className="mt-2 text-gray-600">
          Connect your YouTube channel to access analytics and generate content
        </p>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="mt-6 w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
            <Youtube className="w-5 h-5 mr-2" />
            Connect YouTube Channel
          </>
        )}
      </button>

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mt-4 text-xs text-gray-500">
          <p>Redirect URI: {import.meta.env.VITE_YOUTUBE_REDIRECT_URI}</p>
        </div>
      )}
    </Card>
  );
};

export default ConnectYouTube;