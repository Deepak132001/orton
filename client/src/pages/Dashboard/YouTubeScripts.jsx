// src/pages/Dashboard/YouTubeScripts.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Wand2, 
  Loader2, 
  Clock,
  Copy,
  CheckCircle,
  AlertCircle,
  Youtube,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as youtubeService from '../../services/youtube.service';

const YouTubeScripts = () => {
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(10);
  const [scriptType, setScriptType] = useState('educational');
  const [generatedScript, setGeneratedScript] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchChannelData();
  }, []);

  const fetchChannelData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // First check if YouTube is connected
      const profileResponse = await youtubeService.getYouTubeProfile();
      console.log('Profile response:', profileResponse);

      if (profileResponse?.data?.channelId) {
        // If connected, get channel details
        const channelInfo = await youtubeService.getChannelInfo(profileResponse.data.channelId);
        console.log('Channel info:', channelInfo);
        setChannelData(channelInfo);
      } else {
        setChannelData(null);
        setError('Channel not connected');
      }
    } catch (error) {
      console.error('Error fetching channel data:', error);
      setChannelData(null);
      setError('Error loading channel data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    try {
      setIsGenerating(true);
      setError('');
      
      const script = await youtubeService.generateVideoScript({
        duration,
        scriptType,
        channelId: channelData.id
      });
      
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(
        `Title: ${generatedScript.title}\n\n` +
        `Duration: ${duration} minutes\n\n` +
        `Hook:\n${generatedScript.hook}\n\n` +
        `Script:\n${generatedScript.script}\n\n` +
        `Call to Action:\n${generatedScript.callToAction}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying script:', error);
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
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Channel Not Connected</h2>
          <p className="mt-2 text-gray-600 mb-6">
            Please connect your YouTube channel to use the script generator.
          </p>
          <Link
            to="/dashboard/youtube-connection"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Youtube className="w-4 h-4 mr-2" />
            Connect YouTube Channel
          </Link>
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Script Generation Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Video Script Generator</h2>
            <p className="mt-1 text-sm text-gray-500">
              Channel: {channelData.title}
            </p>
            <p className="text-sm text-gray-500">
              Niche: {channelData.niche}
            </p>
          </div>
        </div>

        <form className="space-y-6">
          {/* Duration Selection */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Video Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={25}>25 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          {/* Content Style */}
          <div>
            <label htmlFor="scriptType" className="block text-sm font-medium text-gray-700">
              Content Style
            </label>
            <select
              id="scriptType"
              value={scriptType}
              onChange={(e) => setScriptType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="educational">Educational/Informative</option>
              <option value="tutorial">Tutorial/How-To</option>
              <option value="vlog">Vlog Style</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Script Based on Channel
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Generated Script Display */}
      {generatedScript && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Generated Script</h3>
            <button
              onClick={handleCopyScript}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Script
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Video Title</h4>
              <p className="mt-2 text-gray-700">{generatedScript.title}</p>
            </div>

            {/* Hook */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Opening Hook (First 30 Seconds)</h4>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{generatedScript.hook}</p>
            </div>

            {/* Main Script */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Main Script</h4>
              <div className="mt-2 text-gray-700 whitespace-pre-line prose max-w-none">
                {generatedScript.script}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Call to Action</h4>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{generatedScript.callToAction}</p>
            </div>

            {/* Duration Info */}
            <div className="flex items-center justify-end text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Script optimized for {duration} minute{duration !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default YouTubeScripts;