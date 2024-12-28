// frontend/src/pages/DataDeletion/index.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, ArrowRight, Mail, Phone } from 'lucide-react';

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Data Deletion Instructions</h1>
            <Link 
              to="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Home
            </Link>
          </div>
          <p className="mt-2 text-sm text-gray-600">Last Updated: December 28, 2024</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Delete Your Data</h2>
            <p className="text-gray-700">
              We respect your privacy and make it easy to delete your account and associated data from Orton AI. 
              Follow the instructions below to remove your data from our systems.
            </p>
          </section>

          {/* Methods to Delete */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Methods to Request Deletion</h3>
            
            {/* Method 1: Self-Service */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Method 1: Through Your Account (Recommended)</h4>
              <ol className="list-decimal ml-6 space-y-2 text-gray-700">
                <li>Log in to your account at ortonai.com</li>
                <li>Navigate to Account Settings</li>
                <li>Click on "Delete Account"</li>
                <li>Follow the confirmation steps</li>
              </ol>
            </div>

            {/* Method 2: Email */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Method 2: Via Email</h4>
              <p className="text-gray-700 mb-2">Send an email to support@ortonai.com with:</p>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Subject: "Data Deletion Request"</li>
                <li>Your registered email address</li>
                <li>Account username</li>
                <li>Brief reason for deletion (optional)</li>
              </ul>
            </div>

            {/* Method 3: Contact Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Method 3: Contact Form</h4>
              <p className="text-gray-700 mb-2">Visit our contact page and submit a deletion request:</p>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                Go to Contact Form <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* What Gets Deleted */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What Gets Deleted</h3>
            <div className="space-y-3 text-gray-700">
              <p>When you request deletion, we will remove:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Your account information and profile data</li>
                <li>Your social media connections and integration data</li>
                <li>Analytics and insights data associated with your account</li>
                <li>Content generated through our platform</li>
                <li>Usage history and preferences</li>
              </ul>
            </div>
          </section>

          {/* Deletion Timeline */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Deletion Timeline</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2 text-blue-800">
                <li>Account deactivation: Immediate</li>
                <li>Personal data deletion: Within 30 days</li>
                <li>Backup data removal: Within 90 days</li>
              </ul>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h3>
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3 text-yellow-800">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <p>Account deletion is permanent and cannot be undone.</p>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <p>Download any important data before requesting deletion.</p>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <p>Content shared on social media platforms remains subject to those platforms' policies.</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">If you need assistance with data deletion, contact us:</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">support@ortonai.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">[Your Support Phone Number]</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DataDeletion;