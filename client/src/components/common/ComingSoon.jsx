//src/components/common/ComingSoon.jsx
import React from 'react';
import { Youtube, Rocket, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { usePlatform } from '../../contexts/PlatformContext';

const ComingSoon = () => {
  const { switchPlatform } = usePlatform();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Youtube className="w-20 h-20 text-red-600" />
            <Rocket className="w-8 h-8 text-blue-500 absolute -top-2 -right-2 transform rotate-45" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          YouTube Integration Coming Soon!
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          We're working hard to bring you powerful YouTube management features.
          Stay tuned for updates!
        </p>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Coming Features:</h3>
            <ul className="mt-2 text-gray-600 space-y-2">
              <li>• Channel Analytics & Insights</li>
              <li>• Video Performance Tracking</li>
              <li>• AI-Powered Script Generation</li>
              <li>• Optimal Upload Time Analysis</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => switchPlatform('instagram')}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Instagram
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Want to be notified when YouTube features launch?
          <a href="mailto:contact@ortonai.com" className="ml-1 text-indigo-600 hover:text-indigo-500">
            Contact us
          </a>
        </p>
      </Card>
    </div>
  );
};

export default ComingSoon;