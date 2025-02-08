// src/pages/Dashboard/ContentIdeas.jsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2, Copy, AlertCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import * as contentService from "../../services/content.service";
import { useResponses } from "../../contexts/ResponseContext";

const ContentCard = ({ idea, onCopy, onDelete, contentType }) => {
  const isRoast = contentType === 'roast';

  const formatContentSection = (content) => {
    if (!content) return [];
    try {
      return content
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.trim());
    } catch (error) {
      console.error("Error formatting content:", error);
      return [];
    }
  };

  const formatCaptions = (captions) => {
    if (!captions) return [];
    if (Array.isArray(captions)) return captions;
    if (typeof captions === "string") return [captions];
    return [];
  };

  const sections = {
    mainContent: formatContentSection(idea?.content),
    captions: formatCaptions(idea?.caption),
  };

  return (
    <Card className={`p-6 bg-white shadow-sm ${isRoast ? 'border-red-200' : ''}`}>
      <div className="space-y-6">
        {/* Title and Type Badge */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`text-xl font-bold ${isRoast ? 'text-red-600' : 'text-gray-900'}`}>
                {idea?.title ? idea.title.split(":").pop().trim() : "Content Idea"}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contentType === 'roast' ? 'bg-red-100 text-red-800' :
                  contentType === 'carousel' ? 'bg-blue-100 text-blue-800' :
                  contentType === 'reel' ? 'bg-pink-100 text-pink-800' :
                  contentType === 'story' ? 'bg-purple-100 text-purple-800' :
                  contentType === 'single' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contentType === 'roast' ? '🔥 Reality Check' :
                   contentType === 'carousel' ? 'Carousel Post' :
                   contentType === 'reel' ? 'Reel' :
                   contentType === 'story' ? 'Story' :
                   contentType === 'single' ? 'Single Post' :
                   'All Types'}
                </span>
              </div>
            </div>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="space-y-6">
          {/* Content Details */}
          {sections.mainContent.length > 0 && (
            <div className={`bg-gray-50 rounded-lg p-4 ${isRoast ? 'border border-red-100' : ''}`}>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Content Details</h4>
              <div className="space-y-4">
                {sections.mainContent.map((point, index) => (
                  <div key={index} className="ml-4">
                    {point.startsWith("•") || point.startsWith("-") ? (
                      <p className="text-gray-700">{point}</p>
                    ) : (
                      <h5 className="font-semibold text-gray-800 mt-3">{point}</h5>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onCopy(sections.mainContent.join("\n"))}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 mt-4"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
          )}

          {/* Captions */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-gray-900">Caption</h4>
            </div>
            <div className="space-y-4">
              {sections.captions.map((caption, index) => (
                <div key={index} className="bg-gray-50 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">Version</span>
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

          {/* Motivational ending for roasts */}
          {isRoast && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mt-4">
              <p className="text-gray-800 font-medium italic">
                "Remember, this roast isn't just criticism – it's your wake-up call. You have real potential; now it's time to prove it. 🔥"
              </p>
            </div>
          )}

          {/* Hashtags */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">Hashtags</h4>
              <button
                onClick={() => onCopy(idea.hashtags.map((tag) => `#${tag}`).join(" "))}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy Hashtags
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {idea.hashtags?.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isRoast ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                  }`}
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

  // without roast
  // return (
  //   <Card className="p-6 bg-white shadow-sm">
  //     <div className="space-y-6">
  //       {/* Title and Actions */}
  //       <div className="border-b pb-4">
  //         <div className="flex justify-between items-start">
  //           <div>
  //             <h3 className="text-xl font-bold text-gray-900">
  //               {idea?.title
  //                 ? idea.title.split(":").pop().trim()
  //                 : "Content Idea"}
  //             </h3>
  //             <div className="mt-2 flex items-center gap-2">
  //               <span
  //                 className={`px-2 py-1 rounded-full text-xs font-medium ${
  //                   contentType === "carousel"
  //                     ? "bg-blue-100 text-blue-800"
  //                     : contentType === "reel"
  //                     ? "bg-pink-100 text-pink-800"
  //                     : contentType === "story"
  //                     ? "bg-purple-100 text-purple-800"
  //                     : contentType === "single"
  //                     ? "bg-green-100 text-green-800"
  //                     : "bg-gray-100 text-gray-800"
  //                 }`}
  //               >
  //                 {contentType === "carousel"
  //                   ? "Carousel Post"
  //                   : contentType === "reel"
  //                   ? "Reel"
  //                   : contentType === "story"
  //                   ? "Story"
  //                   : contentType === "single"
  //                   ? "Single Post"
  //                   : "All Types"}
  //               </span>
  //             </div>
  //           </div>
  //           <button
  //             onClick={onDelete}
  //             className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
  //             aria-label="Delete content"
  //           >
  //             <Trash2 className="h-5 w-5" />
  //           </button>
  //         </div>
  //       </div>

  //       {/* Main Content Section */}
  //       <div className="space-y-6">
  //         {/* Content Details */}
  //         {sections.mainContent.length > 0 && (
  //           <div className="bg-gray-50 rounded-lg p-4">
  //             <h4 className="text-lg font-semibold text-gray-900 mb-3">
  //               Content Details
  //             </h4>
  //             <div className="space-y-4">
  //               {sections.mainContent.map((point, index) => (
  //                 <div key={index} className="ml-4">
  //                   {point.startsWith("•") || point.startsWith("-") ? (
  //                     <p className="text-gray-700">{point}</p>
  //                   ) : (
  //                     <h5 className="font-medium text-gray-800 mt-3">
  //                       {point}
  //                     </h5>
  //                   )}
  //                 </div>
  //               ))}
  //             </div>
  //             <button
  //               onClick={() => onCopy(sections.mainContent.join("\n"))}
  //               className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 mt-4"
  //             >
  //               <Copy className="h-3 w-3" />
  //               <span>Copy</span>
  //             </button>
  //           </div>
  //         )}

  //         {/* Captions */}
  //         <div className="border rounded-lg p-4">
  //           <div className="flex justify-between items-center mb-3">
  //             <h4 className="text-lg font-semibold text-gray-900">Caption</h4>
  //           </div>
  //           <div className="space-y-4">
  //             {sections.captions.map((caption, index) => (
  //               <div key={index} className="bg-gray-50 rounded p-4">
  //                 <div className="flex justify-between items-start mb-2">
  //                   <span className="text-sm font-medium text-gray-600">
  //                     Version
  //                   </span>
  //                   <button
  //                     onClick={() => onCopy(caption)}
  //                     className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
  //                   >
  //                     <Copy className="h-3 w-3" />
  //                     <span>Copy</span>
  //                   </button>
  //                 </div>
  //                 <p className="text-gray-700 whitespace-pre-line">{caption}</p>
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Hashtags */}
  //         <div className="border rounded-lg p-4">
  //           <div className="flex justify-between items-center mb-2">
  //             <h4 className="text-lg font-semibold text-gray-900">Hashtags</h4>
  //             <button
  //               onClick={() =>
  //                 onCopy(idea.hashtags.map((tag) => `#${tag}`).join(" "))
  //               }
  //               className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
  //             >
  //               <Copy className="h-4 w-4 mr-1" /> Copy Hashtags
  //             </button>
  //           </div>
  //           <div className="flex flex-wrap gap-2">
  //             {idea.hashtags?.map((tag, tagIndex) => (
  //               <span
  //                 key={tagIndex}
  //                 className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
  //               >
  //                 #{tag}
  //               </span>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </Card>
  // );
};

const ContentIdeas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentType, setContentType] = useState("all");
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const { responses, saveResponse, deleteResponse } = useResponses();

  // const handleCopy = async (text) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     // Optionally add a toast notification here
  //   } catch (err) {
  //     console.error("Failed to copy:", err);
  //   }
  // };
  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      // Optionally add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // const generateNewIdea = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     setIsGenerationComplete(false);

  //     // Generate new content
  //     const newIdea = await contentService.generateContentIdea(contentType);

  //     // Save the generated content to database
  //     await saveResponse({ ...newIdea, contentType }, 'instagram');

  //     setIsGenerationComplete(true);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to generate content");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const generateNewIdea = async () => {
    try {
      setLoading(true);
      setError("");
      setIsGenerationComplete(false);
      
      // Generate new content
      const newIdea = await contentService.generateContentIdea(contentType);
      
      // Save generated content with correct type
      const responseData = {
        ideas: newIdea.ideas,
        contentType: contentType
      };
      
      await saveResponse(responseData, 'instagram');
      setIsGenerationComplete(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (responseId) => {
    try {
      await deleteResponse(responseId);
    } catch (err) {
      setError("Failed to delete response");
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
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="carousel">Carousel Posts</option>
          <option value="single">Single Post</option>
          <option value="reel">Reels</option>
          <option value="story">Stories</option>
          <option value="roast">Roast my profile🔥</option>
        </select>

        <button
          onClick={generateNewIdea}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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

      {/* Content Display */}
      <div className="space-y-6">
        {/* Use SavedResponses component to display responses */}
        <SavedResponses onCopy={handleCopy} onDelete={handleDelete} />

        {/* Show message after generation */}
        {isGenerationComplete && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-3">
              Want more personalized content? Get real-time AI assistance to
              craft your perfect post!
            </p>
            <Link
              to="/dashboard/content-chat"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Chat with AI for Tailored Content Creation →
            </Link>
          </div>
        )}

        {/* Empty State */}
        {/* {!loading && !responses?.length && (
          <div className="text-center py-12">
            <Wand2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No content ideas yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Click the 'Generate Ideas' button to create new content ideas
            </p>
          </div>
        )} */}
        {!loading && (!responses || responses.length === 0) && (
          <div className="text-center py-12">
            <Wand2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No content ideas yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Click the 'Generate Ideas' button to create new content ideas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// SavedResponses component to display persisted responses
const SavedResponses = ({ onCopy, onDelete }) => {
  const { responses } = useResponses();

  return (
    <>
      {/* {responses.map((response) => (
        response.content.ideas?.map((idea, index) => (
          <ContentCard
            key={`${response._id}-${index}`}
            idea={idea}
            contentType={response.contentType}
            onCopy={onCopy}
            onDelete={() => onDelete(response._id)}
          />
        ))
      ))} */}
      {responses.map(
        (response) =>
          Array.isArray(response.content.ideas) &&
          response.content.ideas.map((idea, index) => (
            <ContentCard
              key={`${response._id}-${index}`}
              idea={idea}
              contentType={response.content.contentType}
              onCopy={onCopy}
              onDelete={() => onDelete(response._id)}
            />
          ))
      )}
    </>
  );
};

export default ContentIdeas;
