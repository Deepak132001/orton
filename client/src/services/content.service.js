// client/src/services/content.service.js

import api from './api';

export const getContentSuggestions = async (contentType = 'all') => {
  const response = await api.get('/content/suggestions', {
    params: { contentType }
  });
  return response.data;
};

export const generateContentIdea = async (contentType) => {
  const response = await api.post('/content/generate', { 
    contentType,
    additionalContext: {
      tone: 'engaging',
      length: 'detailed',
      includeHashtags: true,
      includeCallToAction: true
    }
  });
  return response.data;
};

export const submitFeedback = async (suggestionId, isPositive) => {
  const response = await api.post('/content/feedback', {
    suggestionId,
    feedback: isPositive ? 'positive' : 'negative'
  });
  return response.data;
};

export const generateCustomContent = async (prompt) => {
  const response = await api.post('/content/generate-custom', {
    prompt,
    additionalContext: {
      tone: 'engaging',
      length: 'detailed',
      includeHashtags: true,
      includeCallToAction: true
    }
  });
  return response.data;
};