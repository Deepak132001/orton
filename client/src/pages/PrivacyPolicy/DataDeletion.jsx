import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Shield, Clock, ExternalLink } from 'lucide-react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
                  and associated data from Orton AI for both Instagram and YouTube integrations.
                </p>
              </div>
            </div>
          </div>

          {/* Platform-Specific Deletion Instructions */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How to Delete Your Data</h3>
            
            <div className="space-y-6">
              {/* Method 1 - Account Dashboard */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">1. Through Your Account Dashboard (Recommended)</h4>
                <ol className="list-decimal ml-5 space-y-2 text-gray-600">
                  <li>Log in to your Orton AI account</li>
                  <li>Go to Settings {'>'} Account</li>
                  <li>Click on "Delete My Account"</li>
                  <li>Select which platform data to delete (Instagram, YouTube, or both)</li>
                  <li>Confirm your decision</li>
                </ol>
              </div>

              {/* Method 2 - Platform Specific */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">2. Platform-Specific Removal</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Instagram Data</h5>
                    <ul className="list-disc ml-5 mt-2 text-gray-600">
                      <li>Go to your Instagram Settings</li>
                      <li>Navigate to Apps and Websites</li>
                      <li>Find Orton AI in the list</li>
                      <li>Remove access</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">YouTube Data</h5>
                    <ul className="list-disc ml-5 mt-2 text-gray-600">
                      <li>Visit Google Security Settings</li>
                      <li>Go to "Third-party apps with account access"</li>
                      <li>Locate Orton AI</li>
                      <li>Click "Remove Access"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Method 3 - Email Request */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">3. Via Email Request</h4>
                <div className="text-gray-600">
                  <p>Send an email to privacy@ortonai.com with:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Subject: "Data Deletion Request"</li>
                    <li>Your registered email</li>
                    <li>Account username</li>
                    <li>Platforms to delete (Instagram, YouTube, or both)</li>
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
                <h3 className="text-lg font-medium text-gray-900">Data Deletion Scope</h3>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Instagram Data</h4>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li>✓ Account analytics and insights</li>
                      <li>✓ Post performance data</li>
                      <li>✓ Generated content and captions</li>
                      <li>✓ Audience analytics</li>
                      <li>✓ Posting schedule information</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">YouTube Data</h4>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li>✓ Channel analytics</li>
                      <li>✓ Video performance data</li>
                      <li>✓ Generated scripts and content</li>
                      <li>✓ Stored transcriptions</li>
                      <li>✓ Viewer analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
           {/* Deletion Timeline */}
           <div className="p-6 border-b bg-gray-50">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Deletion Timeline</h3>
                <div className="mt-4 space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Immediate Actions</h4>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Account access deactivation</li>
                      <li>Platform connection removal</li>
                      <li>Service access termination</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Within 30 Days</h4>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Primary database data deletion</li>
                      <li>Analytics data removal</li>
                      <li>Generated content removal</li>
                      <li>User preferences deletion</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Within 90 Days</h4>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Backup data removal</li>
                      <li>Cache data clearance</li>
                      <li>Log data anonymization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform-Specific Notes */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform-Specific Notes</h3>
            
            <div className="space-y-6">
              <div className="bg-pink-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Instagram Data</h4>
                <ul className="mt-2 list-disc pl-5 text-gray-600">
                  <li>Platform connection will be removed automatically</li>
                  <li>Historical analytics will be deleted</li>
                  <li>Generated content will be removed</li>
                  <li>Instagram access tokens will be revoked</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">YouTube Data</h4>
                <ul className="mt-2 list-disc pl-5 text-gray-600">
                  <li>YouTube API access will be revoked</li>
                  <li>Channel analytics will be removed</li>
                  <li>Stored transcriptions will be deleted</li>
                  <li>Generated scripts will be removed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Important Notes</h3>
            <div className="space-y-4 text-gray-600">
              <p>• Account deletion is permanent and cannot be undone</p>
              <p>• Download any important data before requesting deletion</p>
              <p>• Platform connections will be automatically removed</p>
              <p>• Some data may be retained for legal compliance</p>
              <p>• Aggregate analytics may be retained in anonymous form</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-700">
                If you need assistance with data deletion, contact our support team at{' '}
                <a href="mailto:support@ortonai.com" className="underline">contact@ortonai.com</a>
              </p>
            </div>

            <div className="mt-6 flex space-x-4">
              <Link 
                to="/privacy" 
                className="text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                Privacy Policy <ArrowLeft className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                to="/terms" 
                className="text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                Terms of Service <ArrowLeft className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataDeletion;