// src/components/youtube/VideoList.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Video, Download, Loader2 } from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const profile = await youtubeService.getYouTubeProfile();
      const videoData = await youtubeService.getVideoMetadata(profile.id);
      setVideos(videoData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranscription = async (videoId) => {
    try {
      await youtubeService.generateTranscription(videoId);
      // Handle success (e.g., show success message or update UI)
    } catch (err) {
      // Handle error
      console.error('Transcription error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Videos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border rounded-lg overflow-hidden">
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {video.snippet.description}
              </p>
              <button
                onClick={() => handleGenerateTranscription(video.id)}
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Transcription
              </button>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
        </div>
      )}
    </Card>
  );
};

export default VideoList;