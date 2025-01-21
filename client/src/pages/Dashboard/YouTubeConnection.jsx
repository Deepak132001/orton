// src/pages/Dashboard/YouTubeConnection.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Youtube, 
  AlertCircle, 
  Loader2,
  Users,
  Video,
  RefreshCw
} from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';

const YouTubeConnection = () => {
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChannelData();
  }, []);

  const fetchChannelData = async () => {
    try {
      setIsLoading(true);
      const response = await youtubeService.getYouTubeProfile();
      if (response?.connected && response?.data) {
        const channelInfo = await youtubeService.getChannelInfo(response.data.channelId);
        setChannelData(channelInfo);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error);
      setError('Failed to load channel information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    const clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;
    
    const scope = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' ');

    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.append('client_id', clientId);
    oauthUrl.searchParams.append('redirect_uri', redirectUri);
    oauthUrl.searchParams.append('response_type', 'code');
    oauthUrl.searchParams.append('scope', scope);
    oauthUrl.searchParams.append('access_type', 'offline');
    oauthUrl.searchParams.append('prompt', 'consent');

    window.location.href = oauthUrl.toString();
  };

  const handleDisconnect = async () => {
    try {
      await youtubeService.disconnectYouTube();
      setChannelData(null);
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
      setError('Failed to disconnect YouTube channel');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!channelData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Youtube className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Connect YouTube Channel
          </h2>
          <p className="mt-2 text-gray-600">
            Connect your YouTube channel to access analytics and generate content
          </p>

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
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Connect YouTube Channel
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {channelData.thumbnail && (
              <img 
                src={channelData.thumbnail}
                alt={channelData.title}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{channelData.title}</h2>
              <p className="mt-1 text-gray-500">{channelData.description}</p>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {parseInt(channelData.subscribers).toLocaleString()} subscribers
                  </span>
                </div>
                <div className="flex items-center">
                  <Video className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {parseInt(channelData.videos).toLocaleString()} videos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Disconnect Channel
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Channel Details</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Channel Type</h4>
            <p className="mt-1 text-sm text-gray-900">{channelData.niche}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Joined YouTube</h4>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(channelData.joinedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Total Views</h4>
            <p className="mt-1 text-sm text-gray-900">
              {parseInt(channelData.views).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YouTubeConnection;