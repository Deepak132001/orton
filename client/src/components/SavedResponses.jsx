// Frontend: Saved Response Component (src/components/SavedResponses.jsx)
import React from 'react';
import { Card } from './ui/card';
import { Trash2, Calendar } from 'lucide-react';
import { useResponses } from '../contexts/ResponseContext';

export const SavedResponses = () => {
  const { responses, loading, deleteResponse } = useResponses();

  if (loading) {
    return <div>Loading saved responses...</div>;
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <Card key={response._id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(response.createdAt).toLocaleDateString()}
              </div>
              {response.content.ideas?.map((idea, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-medium text-gray-900">{idea.title}</h3>
                  <p className="mt-1 text-gray-600">{idea.content}</p>
                  {idea.hashtags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {idea.hashtags.map((tag, tagIdx) => (
                        <span 
                          key={tagIdx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => deleteResponse(response._id)}
              className="ml-4 p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </Card>
      ))}
      {responses.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No saved responses yet
        </div>
      )}
    </div>
  );
};