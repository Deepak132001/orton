// src/pages/Dashboard/ContentIdeas.jsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Layout,
  Images,
  Image,
  Play,
  CircleUser,
  Flame,
  Wand2,
  Loader2,
  Copy,
  AlertCircle,
  Trash2,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import * as contentService from "../../services/content.service";
import { useResponses } from "../../contexts/ResponseContext";

// Add this new component for typing effect
const TypewriterContent = ({ content, isComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  
  useEffect(() => {
    if (!content) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index <= content.length) {
        setDisplayedContent(content.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // I can adjust the speed as needed

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="whitespace-pre-line">
        {displayedContent}
        {!isComplete && (
          <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 animate-pulse"/>
        )}
      </div>
    </div>
  );
};


const ContentCard = ({
  idea,
  onCopy,
  onDelete,
  contentType,
  responseId,
  ideaIndex,
  onIdeaUpdate,
}) => {
  const [message, setMessage] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedContent, setModifiedContent] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(true);

  const isRoast = contentType === "roast";

  // const handleModification = async (e) => {
  //   e.preventDefault();
  //   if (!message.trim()) return;

  //   setIsModifying(true);
  //   try {
  //     const response = await contentService.generateCustomContent(
  //       message,
  //       idea
  //     );
  //     if (response.ideas && response.ideas.length > 0) {
  //       onIdeaUpdate(responseId, ideaIndex, response.ideas[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error modifying idea:", error);
  //     alert("Failed to modify idea. Please try again.");
  //   } finally {
  //     setIsModifying(false);
  //     setMessage("");
  //   }
  // };
  const handleModification = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsModifying(true);
    setIsTypingComplete(false);
    try {
      // First show typing animation with temporary content
      setModifiedContent("Bruh, I ain't got all the fancy features yet… but hold up, greatness takes time!");
      
      // Generate the new content
      const response = await contentService.generateCustomContent(message, idea);
      if (response.ideas && response.ideas.length > 0) {
        const newIdea = response.ideas[0];
        // Show the new content being typed
        setModifiedContent(
          `Title: ${newIdea.title}\n\nContent: ${newIdea.content}\n\nCaption: ${newIdea.caption}\n\nHashtags: ${newIdea.hashtags.join(', ')}`
        );
        
        // After typing animation, update the actual content
        setTimeout(() => {
          onIdeaUpdate(responseId, ideaIndex, newIdea);
          setIsTypingComplete(true);
          setModifiedContent('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error modifying idea:', error);
      alert('Failed to modify idea. Please try again.');
      setModifiedContent('');
    } finally {
      setIsModifying(false);
      setMessage('');
    }
  };

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
    <>
    <Card
      className={`p-6 bg-white shadow-sm ${isRoast ? "border-red-200" : ""}`}
    >
      <div className="space-y-6">
        {/* Title and Type Badge */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`text-xl font-bold ${
                  isRoast ? "text-red-600" : "text-gray-900"
                }`}
              >
                {idea?.title
                  ? idea.title.split(":").pop().trim()
                  : "Content Idea"}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contentType === "roast"
                      ? "bg-red-100 text-red-800"
                      : contentType === "carousel"
                      ? "bg-blue-100 text-blue-800"
                      : contentType === "reel"
                      ? "bg-pink-100 text-pink-800"
                      : contentType === "story"
                      ? "bg-purple-100 text-purple-800"
                      : contentType === "single"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {contentType === "roast"
                    ? "🔥 Reality Check"
                    : contentType === "carousel"
                    ? "Carousel Post"
                    : contentType === "reel"
                    ? "Reel"
                    : contentType === "story"
                    ? "Story"
                    : contentType === "single"
                    ? "Single Post"
                    : "All Types"}
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
            <div
              className={`bg-gray-50 rounded-lg p-4 ${
                isRoast ? "border border-red-100" : ""
              }`}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                Content Details
              </h4>
              <div className="space-y-4">
                {sections.mainContent.map((point, index) => (
                  <div key={index} className="ml-4">
                    {point.startsWith("•") || point.startsWith("-") ? (
                      <p className="text-gray-700">{point}</p>
                    ) : (
                      <h5 className="font-semibold text-gray-800 mt-3">
                        {point}
                      </h5>
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
                    <span className="text-sm font-medium text-gray-600">
                      Version
                    </span>
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
                "Remember, this roast isn't just criticism – it's your wake-up
                call. You have real potential; now it's time to prove it. 🔥"
              </p>
            </div>
          )}

          {/* Hashtags */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">Hashtags</h4>
              <button
                onClick={() =>
                  onCopy(idea.hashtags.map((tag) => `#${tag}`).join(" "))
                }
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
                    isRoast
                      ? "bg-red-100 text-red-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!isTypingComplete && modifiedContent && (
        <TypewriterContent 
          content={modifiedContent} 
          isComplete={isTypingComplete}
        />
      )}
        {/* Modification Chat Section */}
        {/* <div className="mt-4 border-t pt-4">
          <form onSubmit={handleModification} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to modify about this idea?"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isModifying}
            />
            <button
              type="submit"
              disabled={isModifying || !message.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isModifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Modify</span>
            </button>
          </form>
        </div> */}
        <div className="mt-4 border-t pt-4">
        <form onSubmit={handleModification} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to modify about this idea?"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isModifying}
          />
          <button
            type="submit"
            disabled={isModifying || !message.trim()}
            className="px-4 py-2 bg-[#0f172a] text-white rounded-md hover:bg-[#1a2744] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isModifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Modify</span>
          </button>
        </form>
      </div>

      </div>
    </Card>
    </>
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

const ContentTypeSelector = ({ selected, onSelect }) => {
  const types = [
    { id: "carousel", label: "Carousel", icon: <Images className="w-4 h-4" /> },
    { id: "single", label: "Single Post", icon: <Image className="w-4 h-4" /> },
    { id: "reel", label: "Reels", icon: <Play className="w-4 h-4" /> },
    { id: "story", label: "Stories", icon: <CircleUser className="w-4 h-4" /> },
    {
      id: "roast",
      label: "Roast Profile",
      icon: <Flame className="w-4 h-4 text-red-500" />,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <h3 className="text-sm font-medium text-gray-700">
          Select content type
        </h3>
        <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300"></div>
        <span className="text-xs sm:text-sm text-gray-500">
          Choose the type of content you want to generate
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              flex items-center justify-center sm:justify-start gap-2 
              px-2 sm:px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 ease-in-out
              ${
                selected === type.id
                  ? "bg-[#0f172a] text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border border-gray-200"
              }
            `}
          >
            {type.icon}
            <span className="text-xs sm:text-sm">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ContentIdeas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentType, setContentType] = useState("carousel");
  const [generatingContent, setGeneratingContent] = useState('');
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const { responses, saveResponse, deleteResponse, updateResponse } = useResponses();

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

  const generateNewIdea = async () => {
    try {
      setLoading(true);
      setError("");
      setIsGenerationComplete(false);
      setGeneratingContent("Hold tight! 🚀 I'm not as quick as ChatGPT, but I promise to make it worth the wait... Creating something special just for you! ✨\n");
      
      const newIdea = await contentService.generateContentIdea(contentType);
      
      // Show the content being generated
      if (newIdea.ideas && newIdea.ideas.length > 0) {
        const idea = newIdea.ideas[0];
        setGeneratingContent(
          `Title: ${idea.title}\n\nContent: ${idea.content}\n\nCaption: ${idea.caption}\n\nHashtags: ${idea.hashtags.join(', ')}`
        );
      }

      // Save after showing typing animation
      setTimeout(async () => {
        const responseData = {
          ideas: newIdea.ideas,
          contentType: contentType
        };
        
        await saveResponse(responseData, 'instagram');
        setIsGenerationComplete(true);
        setGeneratingContent('');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate content");
      setGeneratingContent('');
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

  const handleIdeaUpdate = async (responseId, ideaIndex, updatedIdea) => {
    try {
      const response = responses.find((r) => r._id === responseId);
      if (!response) return;

      const updatedIdeas = [...response.content.ideas];
      updatedIdeas[ideaIndex] = updatedIdea;

      const updatedResponse = {
        ...response,
        content: {
          ...response.content,
          ideas: updatedIdeas,
        },
      };

      await updateResponse(responseId, updatedResponse);
    } catch (err) {
      setError("Failed to update idea");
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Content Type Selector - takes up more space */}
          <div className="flex-grow">
            <ContentTypeSelector
              selected={contentType}
              onSelect={setContentType}
            />
          </div>

          {/* Generate Button - more compact on desktop */}
          <button
            onClick={generateNewIdea}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg text-white bg-[#0f172a] hover:bg-[#1a2744] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md min-w-[160px]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
            <span className="font-semibold">Generate Ideas</span>
          </button>
        </div>
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

      {/* Typing Animation for New Content */}
      {generatingContent && !isGenerationComplete && (
        <TypewriterContent 
          content={generatingContent} 
          isComplete={isGenerationComplete}
        />
      )}

      {/* Content Display */}
      <div className="space-y-6">
        {/* Use SavedResponses component to display responses */}
        <SavedResponses
          onCopy={handleCopy}
          onDelete={handleDelete}
          onIdeaUpdate={handleIdeaUpdate}
        />

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
const SavedResponses = ({ onCopy, onDelete, onIdeaUpdate }) => {
  const { responses } = useResponses();

  return (
    <>
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
              onIdeaUpdate={onIdeaUpdate}
              responseId={response._id}
              ideaIndex={index}
            />
          ))
      )}
    </>
  );
};

export default ContentIdeas;
