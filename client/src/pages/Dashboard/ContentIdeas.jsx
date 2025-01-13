// import { useState, useEffect } from 'react';
// import { Card } from '@/components/ui/card';
// import { Wand2, Loader2, Copy, AlertCircle } from 'lucide-react';
// import * as contentService from '../../services/content.service';
// import * as instagramService from '../../services/instagram.service';

// // ContentCard component embedded within ContentIdeas
// const ContentCard = ({ idea, onCopy }) => {
//   // Helper function to format content sections
//   const formatContentSection = (content) => {
//     if (!content) return [];
//     try {
//       return content
//         .split('\n')
//         .filter(line => line.trim().length > 0)
//         .map(line => line.trim());
//     } catch (error) {
//       console.error('Error formatting content:', error);
//       return [];
//     }
//   };

//   // Safely access and format sections
//   const sections = {
//     mainContent: formatContentSection(idea?.mainContent || idea?.content),
//     visualGuide: formatContentSection(idea?.visualGuide),
//     caption: idea?.caption ? (
//       Array.isArray(idea.caption) ? idea.caption : idea.caption.split('\n\n')
//     ) : [],
//     hashtags: Array.isArray(idea?.hashtags) ? idea.hashtags : []
//   };

//   return (
//     <Card className="p-6 bg-white shadow-sm">
//       <div className="space-y-6">
//         {/* Title */}
//         <div className="border-b pb-4">
//           <h3 className="text-xl font-bold text-gray-900">
//             {idea?.title ? idea.title.split(':').pop().trim() : 'Content Idea'}
//           </h3>
//         </div>

//         {/* Main Content Section */}
//         <div className="space-y-6">
//           {/* Content Details */}
//           {sections.mainContent.length > 0 && (
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="text-lg font-semibold text-gray-900 mb-3">Content Details</h4>
//               <div className="space-y-4">
//                 {sections.mainContent.map((point, index) => (
//                   <div key={index} className="ml-4">
//                     {point.startsWith('•') || point.startsWith('-') ? (
//                       <p className="text-gray-700">{point}</p>
//                     ) : (
//                       <h5 className="font-medium text-gray-800 mt-3">{point}</h5>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Visual Guidelines */}
//           {sections.visualGuide.length > 0 && (
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="text-lg font-semibold text-gray-900 mb-3">Visual Guidelines</h4>
//               <div className="space-y-2">
//                 {sections.visualGuide.map((point, index) => (
//                   <p key={index} className="text-gray-700 ml-4">{point}</p>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Caption Blocks */}
//           {sections.caption.length > 0 && (
//             <div className="border rounded-lg p-4 bg-white">
//               <div className="flex justify-between items-center mb-3">
//                 <h4 className="text-lg font-semibold text-gray-900">Captions</h4>
//                 <button
//                   onClick={() => onCopy(sections.caption.join('\n\n'))}
//                   className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
//                 >
//                   <Copy className="h-4 w-4" />
//                   <span>Copy All</span>
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 {sections.caption.map((caption, index) => (
//                   <div key={index} className="border rounded p-3 bg-gray-50">
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-sm font-medium text-gray-600">Version {index + 1}</span>
//                       <button
//                         onClick={() => onCopy(caption)}
//                         className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
//                       >
//                         <Copy className="h-3 w-3" />
//                         <span>Copy</span>
//                       </button>
//                     </div>
//                     <p className="text-gray-700 whitespace-pre-line">{caption}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Hashtags */}
//           {sections.hashtags.length > 0 && (
//             <div className="border rounded-lg p-4 bg-white">
//               <div className="flex justify-between items-center mb-2">
//                 <h4 className="text-lg font-semibold text-gray-900">Hashtags</h4>
//                 <button
//                   onClick={() => onCopy(sections.hashtags.map(tag => `#${tag}`).join(' '))}
//                   className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
//                 >
//                   <Copy className="h-4 w-4" />
//                   <span>Copy</span>
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {sections.hashtags.map((tag, tagIndex) => (
//                   <span
//                     key={tagIndex}
//                     className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// };

// const ContentIdeas = () => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [contentType, setContentType] = useState('all');
//   const [postingTimes, setPostingTimes] = useState(null);
//   const [timeLoading, setTimeLoading] = useState(true);

//   useEffect(() => {
//     fetchPostingTimes();
//   }, []);

//   const fetchPostingTimes = async () => {
//     try {
//       setTimeLoading(true);
//       const data = await instagramService.getBestPostingTimes();
//       setPostingTimes(data);
//     } catch (err) {
//       console.error('Failed to fetch posting times:', err);
//     } finally {
//       setTimeLoading(false);
//     }
//   };

//   const contentTypes = [
//     { id: 'all', label: 'All Types' },
//     { id: 'carousel', label: 'Carousel Posts' },
//     { id: 'single', label: 'Single Posts' },
//     { id: 'reel', label: 'Reels' },
//     { id: 'story', label: 'Stories' }
//   ];

//   const generateNewIdea = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const newIdea = await contentService.generateContentIdea(contentType);
//       console.log('Generated idea:', newIdea); // Debug log
//       setSuggestions([newIdea]);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to generate new content');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       // Optionally add a toast notification here
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold text-gray-900">Content Ideas</h1>
//         <p className="mt-2 text-gray-600">
//           Generate AI-powered content ideas with captions and hashtags
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4">
//         <select
//           value={contentType}
//           onChange={(e) => setContentType(e.target.value)}
//           className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//         >
//           {contentTypes.map((type) => (
//             <option key={type.id} value={type.id}>
//               {type.label}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={generateNewIdea}
//           disabled={loading}
//           className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//         >
//           {loading ? (
//             <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//           ) : (
//             <Wand2 className="-ml-1 mr-2 h-4 w-4" />
//           )}
//           Generate Ideas
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <div className="flex">
//             <AlertCircle className="h-5 w-5 text-red-400" />
//             <p className="ml-3 text-sm text-red-600">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Content Ideas */}
//       <div className="space-y-6">
//         {suggestions.map((suggestion, index) => {
//           // Handle both array and single object responses
//           const ideas = Array.isArray(suggestion?.ideas) 
//             ? suggestion.ideas 
//             : Array.isArray(suggestion) 
//               ? suggestion 
//               : [suggestion];

//           return ideas.map((idea, ideaIndex) => (
//             <ContentCard 
//               key={idea.id || `${index}-${ideaIndex}`} 
//               idea={idea} 
//               onCopy={handleCopy}
//             />
//           ));
//         })}
//       </div>

//       {/* Empty State */}
//       {!loading && suggestions.length === 0 && (
//         <div className="text-center py-12">
//           <Wand2 className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No content ideas yet</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             Click the 'Generate Ideas' button to create new content ideas
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContentIdeas;

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Wand2, Loader2, Copy, AlertCircle } from 'lucide-react';
import * as contentService from '../../services/content.service';
import * as instagramService from '../../services/instagram.service';
import { Link } from 'react-router-dom';

// Helper function to format content sections
const formatContentSection = (content) => {
  if (!content) return [];
  try {
    return content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
  } catch (error) {
    console.error('Error formatting content:', error);
    return [];
  }
};

// Helper function to format captions
const formatCaptions = (caption) => {
  if (!caption) return [];
  if (Array.isArray(caption)) return caption;
  if (typeof caption === 'string') {
    // Try to split by double newlines first
    const splitByDoubleNewline = caption.split('\n\n').filter(c => c.trim());
    if (splitByDoubleNewline.length > 1) return splitByDoubleNewline;
    
    // If no double newlines, try single newlines
    const splitByNewline = caption.split('\n').filter(c => c.trim());
    if (splitByNewline.length > 1) return splitByNewline;
    
    // If still no splits, return as single caption
    return [caption];
  }
  return [];
};

const ContentCard = ({ idea, onCopy }) => {
  // Debug log to see what data we're receiving
  console.log('Received idea:', idea);

  // Helper function to format content sections
  const formatContentSection = (content) => {
    if (!content) return [];
    try {
      return content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());
    } catch (error) {
      console.error('Error formatting content:', error);
      return [];
    }
  };

  // Helper function to ensure captions is always an array
  const formatCaptions = (captions) => {
    if (!captions) return [];
    if (Array.isArray(captions)) return captions;
    if (typeof captions === 'string') return [captions];
    return [];
  };

  const sections = {
    mainContent: formatContentSection(idea?.content),
    captions: formatCaptions(idea?.caption)
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        {/* Title */}
        <div className="border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {idea?.title ? idea.title.split(':').pop().trim() : 'Content Idea'}
          </h3>
        </div>

        {/* Main Content Section */}
        <div className="space-y-6">
          {/* Content Details */}
          {sections.mainContent.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Content Details</h4>
              <div className="space-y-4">
                {sections.mainContent.map((point, index) => (
                  <div key={index} className="ml-4">
                    {point.startsWith('•') || point.startsWith('-') ? (
                      <p className="text-gray-700">{point}</p>
                    ) : (
                      <h5 className="font-medium text-gray-800 mt-3">{point}</h5>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Captions */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-gray-900">Captions</h4>
              <button
                onClick={() => onCopy(sections.captions.join('\n\n'))}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy All</span>
              </button>
            </div>
            <div className="space-y-4">
              {sections.captions.map((caption, index) => (
                <div key={index} className="bg-gray-50 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">Version {index + 1}</span>
                    <button
                      onClick={() => onCopy(caption)}
                      className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">Hashtags</h4>
              <button
                onClick={() => onCopy(idea.hashtags.map(tag => `#${tag}`).join(' '))}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy Hashtags
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {idea.hashtags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ContentIdeas = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentType, setContentType] = useState('all');
  const [postingTimes, setPostingTimes] = useState(null);
  const [timeLoading, setTimeLoading] = useState(true);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  useEffect(() => {
    fetchPostingTimes();
  }, []);

  const fetchPostingTimes = async () => {
    try {
      setTimeLoading(true);
      const data = await instagramService.getBestPostingTimes();
      setPostingTimes(data);
    } catch (err) {
      console.error('Failed to fetch posting times:', err);
    } finally {
      setTimeLoading(false);
    }
  };

  const contentTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'carousel', label: 'Carousel Posts' },
    { id: 'single', label: 'Single Posts' },
    { id: 'reel', label: 'Reels' },
    { id: 'story', label: 'Stories' }
  ];

  // const generateNewIdea = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
  //     const newIdea = await contentService.generateContentIdea(contentType);
  //     console.log('Generated idea:', newIdea);
  //     setSuggestions([newIdea]);
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to generate new content');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const generateNewIdea = async () => {
    try {
      setLoading(true);
      setError('');
      setIsGenerationComplete(false); // Reset generation state
      const newIdea = await contentService.generateContentIdea(contentType);
      setSuggestions([newIdea]);
      setIsGenerationComplete(true); // Set to true when generation is complete
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate new content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Ideas</h1>
        <p className="mt-2 text-gray-600">
          Generate AI-powered content ideas with captions and hashtags
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {contentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <button
          onClick={generateNewIdea}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          ) : (
            <Wand2 className="-ml-1 mr-2 h-4 w-4" />
          )}
          Generate Ideas
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Content Ideas */}
      <div className="space-y-6">
      {/* Your existing content */}
      <div className="space-y-6">
        {suggestions.map((suggestion) => (
          suggestion.ideas?.map((idea, index) => (
            <ContentCard
              key={idea.id || index}
              idea={idea}
              onCopy={handleCopy}
            />
          ))
        ))}

        {/* Show message only after content generation is complete */}
        {isGenerationComplete && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-3">
              Want more personalized content? Get real-time AI assistance to craft your perfect post!
            </p>
            <Link
              to="/dashboard/content-chat"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Chat with AI for Tailored Content Creation →
            </Link>
          </div>
        )}
      </div>
    </div>
      {/* <div className="space-y-6">
        {suggestions.map((suggestion, index) => {
          // Handle both array and single object responses
          const ideas = Array.isArray(suggestion?.ideas) 
            ? suggestion.ideas 
            : Array.isArray(suggestion) 
              ? suggestion 
              : [suggestion];

          return ideas.map((idea, ideaIndex) => (
            <ContentCard 
              key={idea.id || `${index}-${ideaIndex}`} 
              idea={idea} 
              onCopy={handleCopy}
            />
          ));
        })}
      </div> */}

        {/* Not getting the desired results link to content page */}
      {/* <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600 mb-3">
          Not getting the exact content you're looking for?
        </p>
        <Link
          to="/dashboard/content-chat"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Chat with AI for Tailored Content Creation →
        </Link>
      </div> */}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div className="text-center py-12">
          <Wand2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content ideas yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the 'Generate Ideas' button to create new content ideas
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentIdeas;