// src/components/youtube/ScriptGenerator.jsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';

const ScriptGenerator = () => {
  const [duration, setDuration] = useState(5);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedScript, setGeneratedScript] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const script = await youtubeService.generateVideoScript(duration, topic);
      setGeneratedScript(script);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Video Script</h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video Duration (minutes)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[5, 10, 15, 20, 25, 30, 45, 60].map((min) => (
              <option key={min} value={min}>{min} minutes</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your video topic"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !topic}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="-ml-1 mr-2 h-5 w-5" />
              Generate Script
            </>
          )}
        </button>
      </form>

      {generatedScript && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Script</h3>
          <div className="bg-gray-50 rounded-md p-4 whitespace-pre-wrap">
            {generatedScript.script}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ScriptGenerator;