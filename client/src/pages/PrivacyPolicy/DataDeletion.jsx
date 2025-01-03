//frontend/src/pages/Legal/DataDeletion.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Shield, Clock, ExternalLink } from 'lucide-react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Data Deletion Instructions</h1>
            </div>
            <p className="text-sm text-gray-500">Last Updated: January 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Introduction */}
          <div className="p-6 border-b">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Your Data Privacy Matters</h2>
                <p className="mt-1 text-gray-600">
                  We respect your right to control your data. This guide explains how to delete your account 
                  and associated data from Orton AI.
                </p>
              </div>
            </div>
          </div>

          {/* Deletion Methods */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How to Delete Your Data</h3>
            
            <div className="space-y-6">
              {/* Method 1 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">1. Through Your Account (Recommended)</h4>
                <ol className="list-decimal ml-5 space-y-2 text-gray-600">
                  <li>Log in to your account</li>
                  <li>Go to Settings {'>'} Account</li>
                  <li>Click on "Delete My Account"</li>
                  <li>Confirm your decision</li>
                </ol>
              </div>

              {/* Method 2 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">2. Via Email Request</h4>
                <div className="text-gray-600">
                  <p>Send an email to support@ortonai.com with:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Subject: "Data Deletion Request"</li>
                    <li>Your registered email</li>
                    <li>Account username</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* What Gets Deleted */}
          <div className="p-6 border-b">
            <div className="flex items-start">
              <Trash2 className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">What Gets Deleted</h3>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>✓ Account information and profile data</li>
                  <li>✓ Generated content and analytics</li>
                  <li>✓ Social media connections</li>
                  <li>✓ Usage history and preferences</li>
                  <li>✓ All stored media files</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deletion Timeline */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Deletion Timeline</h3>
                <div className="mt-2 space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <div className="w-24">Immediate:</div>
                    <div>Account deactivation</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24">30 days:</div>
                    <div>Permanent data deletion</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24">90 days:</div>
                    <div>Backup data removal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Important Notes</h3>
            <div className="space-y-4 text-gray-600">
              <p>• Account deletion is permanent and cannot be undone</p>
              <p>• Download any important data before requesting deletion</p>
              <p>• Content shared on social media platforms remains subject to their policies</p>
              <p>• Certain data may be retained for legal compliance</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-700">
                If you need assistance with data deletion, contact our support team at{' '}
                <a href="mailto:support@ortonai.com" className="underline">support@ortonai.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataDeletion;