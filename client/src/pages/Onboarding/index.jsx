// client/src/pages/Onboarding/index.jsx

import { Link, useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Instagram className="w-16 h-16 text-pink-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome to Orton AI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's get you started by connecting your Instagram account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Here's what you'll need:
              </h3>
              <ul className="mt-4 list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>Instagram Business or Creator Account</li>
                <li>Connected Facebook Page</li>
                <li>Admin access to your Facebook Page</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Link
                to="/dashboard/instagram-connection"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Connect Instagram Account
              </Link>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                I'll do this later
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                By connecting your account, you agree to give this application access to your Instagram Business account data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;