// client/src/components/dashboard/ContentSuggestions.jsx
import { Card } from '@/components/ui/card';

const ContentSuggestions = ({ suggestions }) => {
  return (
    <Card className="p-4 mt-6">
      <h3 className="text-lg font-medium text-gray-900">Content Suggestions</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions?.map((suggestion, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
            <p className="mt-2 text-sm text-gray-500">{suggestion.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestion.tags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};