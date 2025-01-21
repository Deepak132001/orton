//frontend/src/pages/Dashboard/ContentChat.jsx
import { useState, useRef, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Loader2, Send } from 'lucide-react';
import * as contentService from '../../services/content.service';

const ContentChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await contentService.generateCustomContent(inputMessage);
      
      const aiMessage = {
        type: 'ai',
        content: response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I was unable to process your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div className="ml-auto bg-indigo-600 text-white rounded-lg p-4 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      );
    }

    if (message.type === 'error') {
      return (
        <div className="mr-auto bg-red-100 text-red-700 rounded-lg p-4 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      );
    }

    // AI Message
    return (
      <div className="mr-auto bg-white border border-gray-200 rounded-lg p-4 max-w-[80%]">
        {message.content.ideas?.map((idea, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="font-medium text-gray-900">
              {idea.title.replace('Title: ', '')}
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {idea.content}
            </p>
            {idea.hashtags && (
              <div className="flex flex-wrap gap-2">
                {idea.hashtags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Assistant</h1>
        <p className="mt-2 text-gray-600">
          Chat with AI to generate customized content ideas for your Instagram
        </p>
      </div>

      {/* Chat Area */}
      <Card className="p-6">
        <div className="flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start a conversation!</p>
                <p className="text-sm mt-2">Try asking:</p>
                <ul className="text-sm mt-1 space-y-1">
                  <li>"Create a carousel post about healthy morning routines"</li>
                  <li>"Generate a reel script about productivity tips"</li>
                  <li>"Write a caption for a fashion post"</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index}>{renderMessage(message)}</div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe the content you want to create..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContentChat;