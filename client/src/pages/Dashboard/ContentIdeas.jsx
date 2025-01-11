// // client/src/pages/Dashboard/ContentIdeas.jsx

// import { useState, useEffect } from 'react';
// import { Card } from '../../components/ui/card';
// import { Wand2, Loader2, Copy, AlertCircle, Clock } from 'lucide-react';
// import * as contentService from '../../services/content.service';
// import * as instagramService from '../../services/instagram.service';

// const BestTimesCard = ({ loading, postingTimes }) => {
//   const getDayName = (day) => {
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     return days[day];
//   };

//   const formatTime = (hour) => {
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:00 ${ampm}`;
//   };

//   if (loading) {
//     return (
//       <Card className="p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="space-y-2">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-6">
//       <div className="flex items-center gap-2 mb-4">
//         <Clock className="h-5 w-5 text-indigo-600" />
//         <h3 className="text-lg font-medium text-gray-900">Best Times to Post</h3>
//       </div>
//       <div className="space-y-4">
//         {postingTimes?.bestHours?.slice(0, 3).map((time, index) => (
//           <div 
//             key={index}
//             className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg"
//           >
//             <div>
//               <span className="text-indigo-900 font-medium">
//                 {formatTime(time.hour)}
//               </span>
//               <p className="text-sm text-indigo-600">
//                 {`${time.engagement.toFixed(1)}% engagement`}
//               </p>
//             </div>
//             <div className="text-sm text-indigo-600">
//               {postingTimes?.bestDays?.[index] && 
//                 `Best on ${getDayName(postingTimes.bestDays[index].day)}`}
//             </div>
//           </div>
//         ))}
//         <p className="text-sm text-gray-500 mt-2">
//           Based on your audience engagement patterns
//         </p>
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
//       setSuggestions([newIdea]);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to generate new content');
//       console.error('Failed to generate idea:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold text-gray-900">Content Ideas</h1>
//         <p className="mt-2 text-gray-600">
//           Generate AI-powered content ideas with optimal posting times
//         </p>
//       </div>

//       {/* Controls Section */}
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
//         {suggestions.map((suggestion) => (
//           suggestion.ideas?.map((idea, index) => (
//             <Card key={idea.id || index} className="p-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-start">
//                   <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
//                   <button
//                     onClick={() => handleCopy(idea.content)}
//                     className="p-1 text-gray-400 hover:text-gray-600"
//                     title="Copy content"
//                   >
//                     <Copy className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <p className="text-gray-600 whitespace-pre-line">{idea.content}</p>

//                 {/* Hashtags */}
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium text-gray-900">Trending Hashtags</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {idea.hashtags?.map((tag, tagIndex) => (
//                       <span
//                         key={tagIndex}
//                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ))
//         ))}
//       </div>

//       {/* Best Posting Times */}
//       <BestTimesCard loading={timeLoading} postingTimes={postingTimes} />

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

//frontend/src/pages/Dashboard/ContentIdeas.jsx
import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Wand2, Loader2, Copy, AlertCircle, } from 'lucide-react';
import * as contentService from '../../services/content.service';
import * as instagramService from '../../services/instagram.service';


// const ContentCard = ({ idea, onCopy }) => {
//   return (
//     <Card className="p-6">
//       <div className="space-y-4">
//         {/* Title */}
//         <div className="flex justify-between items-start">
//           <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
//           <div className="flex gap-2">
//             <button
//               onClick={() => onCopy(idea.content)}
//               className="p-1 text-gray-400 hover:text-gray-600"
//               title="Copy content"
//             >
//               <Copy className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="space-y-4">
//           {/* Main Content */}
//           <div>
//             <h4 className="text-sm font-medium text-gray-900 mb-2">Content</h4>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-gray-600 whitespace-pre-line">{idea.content}</p>
//             </div>
//           </div>

//           {/* Caption */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="text-sm font-medium text-gray-900">Caption</h4>
//               <button
//                 onClick={() => onCopy(idea.caption)}
//                 className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
//               >
//                 <Copy className="h-4 w-4 mr-1" /> Copy Caption
//               </button>
//             </div>
//             <div className="bg-white border border-gray-200 rounded-lg p-4">
//               <p className="text-gray-600 whitespace-pre-line">{idea.caption}</p>
//             </div>
//           </div>

//           {/* Hashtags */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="text-sm font-medium text-gray-900">Hashtags</h4>
//               <button
//                 onClick={() => onCopy(idea.hashtags.map(tag => `#${tag}`).join(' '))}
//                 className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
//               >
//                 <Copy className="h-4 w-4 mr-1" /> Copy Hashtags
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {idea.hashtags?.map((tag, tagIndex) => (
//                 <span
//                   key={tagIndex}
//                   className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
//                 >
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };
const ContentCard = ({ idea, onCopy }) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Title */}
        <div className="border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">{idea.title}</h3>
        </div>

        {/* Strategy Content */}
        <div className="space-y-6">
          {/* Trading Strategy */}
          <div>
            {/* <h4 className="text-lg font-semibold text-gray-900 mb-3">Trading Strategy Details:</h4> */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: idea.content }} />
            </div>
          </div>

          {/* Caption Box */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">Caption:</h4>
              <button
                onClick={() => onCopy(idea.caption)}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy Caption
              </button>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{idea.caption}</p>
          </div>

          {/* Hashtags */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">Hashtags:</h4>
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

  const generateNewIdea = async () => {
    try {
      setLoading(true);
      setError('');
      const newIdea = await contentService.generateContentIdea(contentType);
      setSuggestions([newIdea]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate new content');
      // console.error('Failed to generate idea:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally add a toast notification here
    } catch (err) {
      // console.error('Failed to copy:', err);
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
        {suggestions.map((suggestion) => (
          suggestion.ideas?.map((idea, index) => (
            <ContentCard 
              key={idea.id || index} 
              idea={idea} 
              onCopy={handleCopy}
            />
          ))
        ))}
      </div>

      {/* Best Posting Times */}
       {/* <BestTimesCard loading={timeLoading} postingTimes={postingTimes} /> */}

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