// src/controllers/youtube.controller.js
import { YouTube, Transcription } from '../models/youtube.model.js';
import { User } from '../models/user.model.js';
import { google } from 'googleapis';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Initialize YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

// Connect YouTube channel
const connectYouTube = async (req, res) => {
  try {
    console.log('Starting YouTube connection process...'); // Debug log
    const { code } = req.body;
    
    if (!code) {
      console.log('No authorization code provided'); // Debug log
      return res.status(400).json({
        message: 'Authorization code is required'
      });
    }

    console.log('Environment variables check:', { // Debug log
      clientId: !!process.env.YOUTUBE_CLIENT_ID,
      clientSecret: !!process.env.YOUTUBE_CLIENT_SECRET,
      redirectUri: process.env.YOUTUBE_REDIRECT_URI
    });

    // Exchange code for tokens
    console.log('Exchanging code for tokens...'); // Debug log
    let tokens;
    try {
      const { tokens: tokenResponse } = await oauth2Client.getToken(code);
      tokens = tokenResponse;
      console.log('Tokens received:', { // Debug log
        accessTokenReceived: !!tokens.access_token,
        refreshTokenReceived: !!tokens.refresh_token,
        expiryDate: tokens.expiry_date
      });
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError); // Debug log
      return res.status(400).json({
        message: 'Failed to exchange authorization code',
        error: tokenError.message
      });
    }

    // Set credentials
    oauth2Client.setCredentials(tokens);

    // Get channel info
    console.log('Fetching channel info...'); // Debug log
    const youtube = google.youtube('v3');
    let channelResponse;
    try {
      channelResponse = await youtube.channels.list({
        auth: oauth2Client,
        part: 'id,snippet,statistics',
        mine: true
      });
      console.log('Channel info received:', { // Debug log
        hasItems: !!channelResponse.data.items?.length,
        firstItemId: channelResponse.data.items?.[0]?.id
      });
    } catch (channelError) {
      console.error('Channel info error:', channelError); // Debug log
      return res.status(500).json({
        message: 'Failed to fetch channel information',
        error: channelError.message
      });
    }

    if (!channelResponse.data.items?.length) {
      console.log('No channel found'); // Debug log
      return res.status(404).json({
        message: 'No YouTube channel found'
      });
    }

    const channel = channelResponse.data.items[0];

    // Save channel information
    console.log('Saving channel information...'); // Debug log
    let youtubeAccount;
    try {
      youtubeAccount = await YouTube.findOneAndUpdate(
        { userId: req.user._id },
        {
          channelId: channel.id,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: new Date(tokens.expiry_date),
          trialStartDate: new Date(),
          isSubscribed: false
        },
        { upsert: true, new: true }
      );
      console.log('Channel information saved:', { // Debug log
        userId: req.user._id,
        channelId: channel.id,
        accountCreated: !!youtubeAccount
      });
    } catch (dbError) {
      console.error('Database error:', dbError); // Debug log
      return res.status(500).json({
        message: 'Failed to save channel information',
        error: dbError.message
      });
    }

    // Return success response
    res.json({
      message: 'YouTube channel connected successfully',
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        subscribers: channel.statistics.subscriberCount,
        videos: channel.statistics.videoCount
      }
    });
  } catch (error) {
    console.error('YouTube connection error:', {
      message: error.message,
      stack: error.stack,
      details: error.response?.data
    });
    
    res.status(500).json({
      message: 'Failed to connect YouTube channel',
      error: error.message,
      details: error.response?.data || {}
    });
  }
};

// Get YouTube profile
const getProfile = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.json({
        connected: false,
        data: null
      });
    }

    return res.json({
      connected: true,
      data: {
        channelId: youtubeAccount.channelId,
        trialStartDate: youtubeAccount.trialStartDate,
        isSubscribed: youtubeAccount.isSubscribed
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get YouTube profile',
      error: error.message
    });
  }
};

// Helper function to fetch all video transcriptions
async function fetchAllVideoTranscriptions(youtubeAccount, channelId) {
  try {
    // Set credentials
    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    let pageToken = '';
    do {
      // Get channel videos
      const response = await youtube.search.list({
        part: 'id',
        channelId: channelId,
        type: 'video',
        maxResults: 50,
        pageToken
      });

      // Process each video
      for (const item of response.data.items) {
        const videoId = item.id.videoId;
        
        // Check if transcription already exists
        const existingTranscription = await Transcription.findOne({
          videoId,
          userId: youtubeAccount.userId
        });

        if (!existingTranscription) {
          try {
            // Try to get captions first
            const captionsResponse = await youtube.captions.list({
              part: 'snippet',
              videoId
            });

            if (captionsResponse.data.items?.length) {
              // Store public captions
              const caption = captionsResponse.data.items[0];
              await Transcription.create({
                videoId,
                channelId,
                userId: youtubeAccount.userId,
                source: 'public_captions',
                transcriptionText: caption.snippet.text,
                language: caption.snippet.language,
                status: 'completed'
              });
            } else {
              // Use Whisper for transcription
              // Note: Implement actual video download and Whisper transcription
              await Transcription.create({
                videoId,
                channelId,
                userId: youtubeAccount.userId,
                source: 'whisper',
                transcriptionText: '',
                status: 'pending'
              });
            }
          } catch (error) {
            console.error(`Error processing video ${videoId}:`, error);
            continue;
          }
        }
      }

      pageToken = response.data.nextPageToken;
    } while (pageToken);

  } catch (error) {
    console.error('Error fetching video transcriptions:', error);
  }
}

// Get video metadata
const getVideoMetadata = async (req, res) => {
  try {
    const { channelId } = req.params;
    const youtubeAccount = await YouTube.findOne({ 
      userId: req.user._id,
      channelId 
    });

    if (!youtubeAccount) {
      return res.status(404).json({
        message: 'YouTube channel not found'
      });
    }

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const response = await youtube.search.list({
      part: 'snippet',
      channelId,
      type: 'video',
      maxResults: 50
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Get video metadata error:', error);
    res.status(500).json({
      message: 'Failed to get video metadata',
      error: error.message
    });
  }
};

// Generate transcription
const generateTranscription = async (req, res) => {
  try {
    const { videoId } = req.body;
    
    // Check if transcription already exists
    const existingTranscription = await Transcription.findOne({
      videoId,
      userId: req.user._id
    });

    if (existingTranscription) {
      return res.json(existingTranscription);
    }

    // Create pending transcription
    const transcription = await Transcription.create({
      videoId,
      channelId: req.user.channelId,
      userId: req.user._id,
      source: 'whisper',
      transcriptionText: '',
      status: 'pending'
    });

    // Start transcription process in background
    generateWhisperTranscription(transcription);

    res.json(transcription);
  } catch (error) {
    console.error('Transcription generation error:', error);
    res.status(500).json({
      message: 'Failed to generate transcription',
      error: error.message
    });
  }
};

// Helper function to generate Whisper transcription
async function generateWhisperTranscription(transcription) {
  try {
    // Update status to processing
    transcription.status = 'processing';
    await transcription.save();

    // TODO: Implement video download and Whisper transcription
    // This is a placeholder - you'll need to implement actual video download
    // and Whisper transcription logic

    // Update transcription with result
    transcription.status = 'completed';
    transcription.transcriptionText = 'Placeholder transcription text';
    await transcription.save();
  } catch (error) {
    console.error('Whisper transcription error:', error);
    transcription.status = 'failed';
    transcription.error = error.message;
    await transcription.save();
  }
}

// Generate video script
// const generateVideoScript = async (req, res) => {
//   try {
//     const { duration, topic } = req.body;
//     const youtubeAccount = await YouTube.findOne({ userId: req.user._id });

//     // Check trial/subscription status
//     const trialEndDate = new Date(youtubeAccount.trialStartDate);
//     trialEndDate.setDate(trialEndDate.getDate() + 4);
//     const isTrialActive = trialEndDate > new Date();

//     if (!isTrialActive && !youtubeAccount.isSubscribed) {
//       return res.status(403).json({
//         message: 'Trial period ended. Please subscribe to continue using YouTube features.'
//       });
//     }

//     // Generate script using ChatGPT
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are a YouTube script writer. Create a detailed script for a ${duration}-minute video.`
//         },
//         {
//           role: "user",
//           content: `Topic: ${topic}\nDesired duration: ${duration} minutes`
//         }
//       ]
//     });

//     res.json({
//       script: completion.choices[0].message.content,
//       duration
//     });
//   } catch (error) {
//     console.error('Script generation error:', error);
//     res.status(500).json({
//       message: 'Failed to generate video script',
//       error: error.message
//     });
//   }
// };
const generateVideoScript = async (req, res) => {
  try {
    console.log('Starting script generation with params:', req.body);
    const { duration, scriptType } = req.body;

    // Get the YouTube account
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    if (!youtubeAccount) {
      console.log('No YouTube account found for user:', req.user._id);
      return res.status(404).json({
        message: 'YouTube account not connected'
      });
    }

    console.log('Found YouTube account:', {
      channelId: youtubeAccount.channelId,
      hasAccessToken: !!youtubeAccount.accessToken
    });

    // Get channel details
    let channelDetails;
    try {
      const channelResponse = await youtube.channels.list({
        part: ['snippet', 'statistics', 'brandingSettings'],
        id: [youtubeAccount.channelId]
      });

      if (!channelResponse.data.items?.length) {
        throw new Error('Channel not found');
      }

      const channel = channelResponse.data.items[0];
      channelDetails = {
        title: channel.snippet.title,
        description: channel.snippet.description,
        statistics: channel.statistics,
        keywords: channel.brandingSettings?.channel?.keywords || ''
      };

      console.log('Retrieved channel details:', {
        title: channelDetails.title,
        hasDescription: !!channelDetails.description
      });
    } catch (channelError) {
      console.error('Error fetching channel details:', channelError);
      throw new Error('Failed to fetch channel details');
    }

    // Generate content using OpenAI
    console.log('Generating script with OpenAI...');
    const scriptPrompt = `Create a detailed ${duration}-minute YouTube video script for a channel in the following niche:

Channel Name: ${channelDetails.title}
Channel Description: ${channelDetails.description}
Content Style: ${scriptType}

Generate a script with these sections:
1. Title: An engaging, SEO-friendly title
2. Hook: A compelling 30-second opening hook
3. Main Script: A detailed ${duration}-minute script
4. Call to Action: Engaging viewer prompts

Use this format:
Title: [Your title here]

Hook:
[Hook content]

Script:
[Main script content]

Call to Action:
[Call to action content]`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert YouTube script writer who creates engaging, well-structured content."
          },
          {
            role: "user",
            content: scriptPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('Successfully generated script');
      const scriptContent = completion.choices[0].message.content;
      const parsedScript = parseScriptSections(scriptContent);

      res.json(parsedScript);
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      throw new Error('Failed to generate script content');
    }
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({
      message: 'Failed to generate video script',
      error: error.message
    });
  }
};

const analyzeChannelTrends = async (recentVideos, topVideos) => {
  // Analyze video titles and descriptions to identify patterns
  const allVideos = [...recentVideos, ...topVideos];
  const titles = allVideos.map(video => video.snippet.title);
  const descriptions = allVideos.map(video => video.snippet.description);

  // Use GPT to analyze patterns
  const analysisPrompt = `Analyze these YouTube video titles and descriptions to identify:
1. Common topics that perform well
2. Content types that engage viewers
3. Audience preferences and patterns
4. Successful elements (e.g., storytelling, tutorials, demonstrations)

Titles: ${titles.join('\n')}
Descriptions: ${descriptions.join('\n')}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a YouTube analytics expert who can identify content patterns and success factors."
      },
      {
        role: "user",
        content: analysisPrompt
      }
    ]
  });

  // Parse the analysis
  const analysis = completion.choices[0].message.content;
  return {
    topTopics: extractTopics(analysis),
    engagingTypes: extractContentTypes(analysis),
    audiencePreferences: extractPreferences(analysis),
    successfulElements: extractElements(analysis)
  };
};

// Helper function to generate topic suggestions
const generateTopicSuggestion = async (channel, recentVideos, topVideos, trends) => {
  const prompt = `Based on this YouTube channel's performance:

Channel Niche: ${channel.niche}
Top Topics: ${trends.topTopics.join(', ')}
Engaging Content Types: ${trends.engagingTypes.join(', ')}
Audience Preferences: ${trends.audiencePreferences}

Suggest a video topic that:
1. Aligns with channel's niche
2. Hasn't been covered recently
3. Follows successful patterns
4. Has high potential for engagement

Recent Videos: ${recentVideos.map(v => v.snippet.title).join(', ')}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a YouTube content strategist who excels at identifying high-potential video topics."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return completion.choices[0].message.content;
};

// Helper function to get channel details
const getChannelDetails = async (channelId, accessToken) => {
  try {
    // Set auth token for this request
    const authenticatedYoutube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    oauth2Client.setCredentials({
      access_token: accessToken
    });

    const response = await authenticatedYoutube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: [channelId],
    });

    if (!response.data.items?.length) {
      throw new Error('Channel not found');
    }

    const channel = response.data.items[0];
    return {
      title: channel.snippet.title,
      description: channel.snippet.description,
      statistics: channel.statistics,
      keywords: channel.brandingSettings?.channel?.keywords || '',
      niche: await analyzeChannelNiche(channel)
    };
  } catch (error) {
    console.error('Error getting channel details:', error);
    throw error;
  }
};

// Helper function to get recent videos
const getRecentVideos = async (channelId) => {
  const youtube = google.youtube('v3');
  const response = await youtube.search.list({
    part: 'snippet',
    channelId,
    type: 'video',
    order: 'date',
    maxResults: 5
  });

  return response.data.items.map(item => ({
    title: item.snippet.title,
    description: item.snippet.description
  }));
};

// Helper function to analyze target audience
const analyzeTargetAudience = async (channel) => {
  const prompt = `Based on this YouTube channel's information, determine its target audience:

Channel Name: ${channel.snippet.title}
Description: ${channel.snippet.description}
Keywords: ${channel.brandingSettings?.channel?.keywords || ''}

Provide a concise description of the target audience demographics and interests.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a YouTube analytics expert who can identify target audiences."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  });

  return completion.choices[0].message.content;
};

// Helper function to analyze channel niche
const analyzeChannelNiche = async (channel) => {
  try {
    const prompt = `Based on this YouTube channel information:
    Title: ${channel.snippet.title}
    Description: ${channel.snippet.description}
    Keywords: ${channel.brandingSettings?.channel?.keywords || ''}
    
    Provide a concise description of the channel's primary niche and content focus.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube analytics expert who can identify content niches."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing channel niche:', error);
    return 'General Content';
  }
};


// Helper function to parse the generated script
const parseGeneratedScript = (content) => {
  const sections = content.split('\n\n');
  const result = {
    title: '',
    hook: '',
    script: '',
    callToAction: ''
  };

  for (const section of sections) {
    if (section.toLowerCase().includes('title:')) {
      result.title = section.replace(/title:/i, '').trim();
    } else if (section.toLowerCase().includes('hook:')) {
      result.hook = section.replace(/hook:/i, '').trim();
    } else if (section.toLowerCase().includes('call to action:')) {
      result.callToAction = section.replace(/call to action:/i, '').trim();
    } else if (section.trim() && !section.toLowerCase().includes('main script:')) {
      result.script += section + '\n\n';
    }
  }

  return result;
};

// Check trial status
const checkTrialStatus = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.status(400).json({
        message: 'YouTube account not connected'
      });
    }

    const trialEndDate = new Date(youtubeAccount.trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 4);
    const isTrialActive = trialEndDate > new Date();

    res.json({
      isTrialActive,
      trialEndDate,
      isSubscribed: youtubeAccount.isSubscribed
    });
  } catch (error) {
    console.error('Check trial status error:', error);
    res.status(500).json({
      message: 'Failed to check trial status',
      error: error.message
    });
  }
};

// Get subscription status
// const getSubscriptionStatus = async (req, res) => {
//   try {
//     const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
//     if (!youtubeAccount) {
//       return res.status(400).json({
//         message: 'YouTube account not connected'
//       });
//     }

//     const trialEndDate = new Date(youtubeAccount.trialStartDate);
//     trialEndDate.setDate(trialEndDate.getDate() + 4);
//     const isTrialActive = trialEndDate > new Date();

//     res.json({
//       isSubscribed: youtubeAccount.isSubscribed,
//       isTrialActive,
//       trialEndDate,
//       subscriptionDetails: {
//         status: youtubeAccount.isSubscribed ? 'active' : 'inactive',
//         features: [
//           'Video transcription',
//           'AI script generation',
//           'Analytics insights',
//           'Unlimited content generation'
//         ]
//       }
//     });
//   } catch (error) {
//     console.error('Get subscription status error:', error);
//     res.status(500).json({
//       message: 'Failed to get subscription status',
//       error: error.message
//     });
//   }
// };
const getSubscriptionStatus = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.status(404).json({
        message: 'YouTube account not connected'
      });
    }

    const trialEndDate = new Date(youtubeAccount.trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 4);
    const isTrialActive = trialEndDate > new Date();

    res.json({
      isSubscribed: youtubeAccount.isSubscribed,
      isTrialActive,
      trialEndDate: trialEndDate.toISOString(),
      features: {
        contentGeneration: true,
        transcriptions: youtubeAccount.isSubscribed || isTrialActive,
        analytics: true
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      message: 'Failed to get subscription status',
      error: error.message
    });
  }
};

// Disconnect YouTube
const disconnectYouTube = async (req, res) => {
  try {
    await YouTube.findOneAndDelete({ userId: req.user._id });
    res.json({
      message: 'YouTube account disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      message: 'Failed to disconnect YouTube account',
      error: error.message
    });
  }
};

// Handle webhook notifications
const handleWebhook = async (req, res) => {
  try {
    const { videoId, channelId } = req.body;

    // Verify the webhook signature
    // TODO: Implement webhook signature verification

    // Find associated YouTube account
    const youtubeAccount = await YouTube.findOne({ channelId });
    if (!youtubeAccount) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Process the new video
    await processNewVideo(videoId, channelId, youtubeAccount);

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      message: 'Failed to process webhook',
      error: error.message
    });
  }
};

// Helper function to process new videos
async function processNewVideo(videoId, channelId, youtubeAccount) {
  try {
    // Check if we already have a transcription for this video
    const existingTranscription = await Transcription.findOne({
      videoId,
      channelId
    });

    if (existingTranscription) {
      return;
    }

    // Create new transcription entry
    const transcription = await Transcription.create({
      videoId,
      channelId,
      userId: youtubeAccount.userId,
      source: 'pending',
      status: 'pending',
      transcriptionText: ''
    });

    // Set OAuth credentials
    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    // Try to get captions
    const captionsResponse = await youtube.captions.list({
      part: 'snippet',
      videoId
    });

    if (captionsResponse.data.items?.length) {
      // Use public captions
      transcription.source = 'public_captions';
      transcription.transcriptionText = captionsResponse.data.items[0].snippet.text;
      transcription.status = 'completed';
    } else {
      // Use Whisper for transcription
      transcription.source = 'whisper';
      // Start Whisper transcription process
      generateWhisperTranscription(transcription);
    }

    await transcription.save();
  } catch (error) {
    console.error('Error processing new video:', error);
    throw error;
  }
}

export const getChannelInfo = async (req, res) => {
  try {
    const { channelId } = req.params;
    const youtubeAccount = await YouTube.findOne({ 
      userId: req.user._id,
      channelId 
    });

    if (!youtubeAccount) {
      return res.status(404).json({
        message: 'Channel not found'
      });
    }

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const youtube = google.youtube('v3');
    const response = await youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet,statistics,brandingSettings,contentDetails',
      id: channelId
    });

    if (!response.data.items?.length) {
      return res.status(404).json({
        message: 'Channel not found'
      });
    }

    const channel = response.data.items[0];
    // Analyze channel content to determine niche
    const niche = await analyzeChannelNiche(channel.snippet.description, channel.brandingSettings?.channel?.keywords);

    res.json({
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails?.high?.url,
      subscribers: channel.statistics.subscriberCount,
      videos: channel.statistics.videoCount,
      views: channel.statistics.viewCount,
      niche,
      topics: channel.brandingSettings?.channel?.keywords?.split(',').map(k => k.trim()) || [],
      joinedAt: channel.snippet.publishedAt
    });
  } catch (error) {
    console.error('Get channel info error:', error);
    res.status(500).json({
      message: 'Failed to get channel information',
      error: error.message
    });
  }
};

export const generateContentIdeas = async (req, res) => {
  try {
    const { channelId } = req.body;
    const youtubeAccount = await YouTube.findOne({ 
      userId: req.user._id,
      channelId 
    });

    if (!youtubeAccount) {
      return res.status(404).json({
        message: 'Channel not found'
      });
    }

    // Get channel info for context
    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const youtube = google.youtube('v3');
    const [channelResponse, videosResponse] = await Promise.all([
      youtube.channels.list({
        auth: oauth2Client,
        part: 'snippet,statistics,brandingSettings',
        id: channelId
      }),
      youtube.search.list({
        auth: oauth2Client,
        part: 'snippet',
        channelId,
        order: 'viewCount',
        type: 'video',
        maxResults: 10
      })
    ]);

    const channel = channelResponse.data.items[0];
    const topVideos = videosResponse.data.items;

    // Generate ideas using OpenAI
    const prompt = `Generate 5 video content ideas for a YouTube channel with the following details:
    Channel: ${channel.snippet.title}
    Niche: ${channel.brandingSettings?.channel?.keywords || channel.snippet.description}
    Top performing videos: ${topVideos.map(v => v.snippet.title).join(', ')}
    
    For each idea include:
    1. Engaging title
    2. Brief description
      3. Target audience
    4. Key talking points
    5. Relevant tags`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a YouTube content strategist who understands trending topics and audience engagement."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Parse the completion into structured ideas
    const ideas = parseContentIdeas(completion.choices[0].message.content);

    res.json({
      ideas: ideas.map(idea => ({
        title: idea.title,
        description: idea.description,
        audience: idea.audience,
        keyPoints: idea.keyPoints,
        tags: idea.tags
      }))
    });
  } catch (error) {
    console.error('Generate content ideas error:', error);
    res.status(500).json({
      message: 'Failed to generate content ideas',
      error: error.message
    });
  }
};

// Helper function to parse GPT response into structured ideas
const parseContentIdeas = (content) => {
  const ideas = [];
  let currentIdea = {};
  
  const lines = content.split('\n').map(line => line.trim());
  
  for (const line of lines) {
    if (line.match(/^(\d+\.|\-)\s/)) {
      if (Object.keys(currentIdea).length > 0) {
        ideas.push(currentIdea);
        currentIdea = {};
      }
      currentIdea.title = line.replace(/^(\d+\.|\-)\s/, '');
    } else if (line.startsWith('Description:')) {
      currentIdea.description = line.replace('Description:', '').trim();
    } else if (line.startsWith('Target Audience:')) {
      currentIdea.audience = line.replace('Target Audience:', '').trim();
    } else if (line.startsWith('Key Points:')) {
      currentIdea.keyPoints = line.replace('Key Points:', '').trim().split(',').map(point => point.trim());
    } else if (line.startsWith('Tags:')) {
      currentIdea.tags = line.replace('Tags:', '').trim().split(',').map(tag => tag.trim());
    }
  }
  
  if (Object.keys(currentIdea).length > 0) {
    ideas.push(currentIdea);
  }

  return ideas;
};

// Helper function to parse script sections
function parseScriptSections(content) {
  const sections = {
    title: '',
    hook: '',
    script: '',
    callToAction: ''
  };

  const lines = content.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.toLowerCase().startsWith('title:')) {
      currentSection = 'title';
      sections.title = trimmedLine.replace(/^title:\s*/i, '');
    } else if (trimmedLine.toLowerCase().startsWith('hook:')) {
      currentSection = 'hook';
    } else if (trimmedLine.toLowerCase().startsWith('script:')) {
      currentSection = 'script';
    } else if (trimmedLine.toLowerCase().startsWith('call to action:')) {
      currentSection = 'callToAction';
    } else if (trimmedLine && currentSection) {
      if (currentSection === 'hook') {
        sections.hook += (sections.hook ? '\n' : '') + trimmedLine;
      } else if (currentSection === 'script') {
        sections.script += (sections.script ? '\n' : '') + trimmedLine;
      } else if (currentSection === 'callToAction') {
        sections.callToAction += (sections.callToAction ? '\n' : '') + trimmedLine;
      }
    }
  }

  return sections;
}

export const getChannelAnalytics = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.status(400).json({
        message: 'YouTube account not connected'
      });
    }

    // Set up YouTube API client
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Get channel info
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [youtubeAccount.channelId]
    });

    const channel = channelResponse.data.items[0];

    // Get recent videos
    const videosResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: youtubeAccount.channelId,
      order: 'date',
      type: 'video',
      maxResults: 10
    });

    // Get video statistics
    const videoIds = videosResponse.data.items.map(item => item.id.videoId);
    const videoStatsResponse = await youtube.videos.list({
      part: ['statistics', 'contentDetails'],
      id: videoIds
    });

    // Calculate engagement metrics
    const videoStats = videoStatsResponse.data.items;
    const totalViews = parseInt(channel.statistics.viewCount);
    const totalVideos = parseInt(channel.statistics.videoCount);
    const avgViews = Math.round(totalViews / totalVideos);

    // Calculate growth rates
    const subscriberCount = parseInt(channel.statistics.subscriberCount);
    const viewCount = parseInt(channel.statistics.viewCount);

    const analyticsResponse = {
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails?.high?.url,
      subscribers: subscriberCount,
      subscriberChange: 0, // You'll need to implement subscriber change tracking
      views: viewCount,
      videos: totalVideos,
      videosThisMonth: videosResponse.data.items.filter(
        video => new Date(video.snippet.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      avgViews,
      viewsPerMonth: Math.round(viewCount / totalVideos * 30),
      engagement: {
        likes: videoStats.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || 0), 0),
        comments: videoStats.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || 0), 0),
        views: videoStats.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0)
      },
      recentVideos: videoStats.map(video => ({
        id: video.id,
        title: videosResponse.data.items.find(v => v.id.videoId === video.id)?.snippet.title,
        views: parseInt(video.statistics.viewCount),
        likes: parseInt(video.statistics.likeCount || 0),
        comments: parseInt(video.statistics.commentCount || 0),
        publishedAt: videosResponse.data.items.find(v => v.id.videoId === video.id)?.snippet.publishedAt
      }))
    };

    res.json(analyticsResponse);
  } catch (error) {
    console.error('Error fetching YouTube analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch YouTube analytics',
      error: error.message
    });
  }
};

// Add route to get upload timing analysis
export const getUploadTiming = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.status(400).json({
        message: 'YouTube account not connected'
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Get videos for timing analysis
    const videosResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: youtubeAccount.channelId,
      order: 'date',
      type: 'video',
      maxResults: 50
    });

    const videoIds = videosResponse.data.items.map(item => item.id.videoId);
    const videoStatsResponse = await youtube.videos.list({
      part: ['statistics', 'contentDetails'],
      id: videoIds
    });

    // Analyze upload patterns
    const uploadTimes = videosResponse.data.items.map(video => {
      const publishDate = new Date(video.snippet.publishedAt);
      return {
        hour: publishDate.getHours(),
        day: publishDate.getDay(),
        stats: videoStatsResponse.data.items.find(v => v.id === video.id.videoId)?.statistics
      };
    });

    // Calculate best times
    const hourlyStats = Array(24).fill(0).map((_, hour) => {
      const uploads = uploadTimes.filter(time => time.hour === hour);
      const engagement = uploads.reduce((sum, upload) => {
        const stats = upload.stats || {};
        return sum + (parseInt(stats.likeCount || 0) + parseInt(stats.commentCount || 0));
      }, 0);
      return {
        hour,
        uploads: uploads.length,
        engagement: uploads.length ? Math.round(engagement / uploads.length) : 0
      };
    });

    const dailyStats = Array(7).fill(0).map((_, day) => {
      const uploads = uploadTimes.filter(time => time.day === day);
      const engagement = uploads.reduce((sum, upload) => {
        const stats = upload.stats || {};
        return sum + (parseInt(stats.likeCount || 0) + parseInt(stats.commentCount || 0));
      }, 0);
      return {
        day,
        uploads: uploads.length,
        engagement: uploads.length ? Math.round(engagement / uploads.length) : 0
      };
    });

    // Find best times
    const bestHours = [...hourlyStats]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    const bestDays = [...dailyStats]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    res.json({
      hourlyData: hourlyStats,
      dailyData: dailyStats,
      bestHours,
      bestDays,
      totalVideos: videoIds.length,
      analyzedDays: 30
    });
  } catch (error) {
    console.error('Error analyzing upload timing:', error);
    res.status(500).json({
      message: 'Failed to analyze upload timing',
      error: error.message
    });
  }
};

export const getBestTimes = async (req, res) => {
  try {
    const youtubeAccount = await YouTube.findOne({ userId: req.user._id });
    
    if (!youtubeAccount) {
      return res.status(400).json({
        message: 'YouTube account not connected'
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Get videos from the last 90 days
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const videosResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: youtubeAccount.channelId,
      order: 'date',
      type: 'video',
      maxResults: 50,
      publishedAfter: threeMonthsAgo.toISOString()
    });

    const videoIds = videosResponse.data.items.map(item => item.id.videoId);
    const videoStatsResponse = await youtube.videos.list({
      part: ['statistics', 'contentDetails'],
      id: videoIds
    });

    const uploadTimes = videosResponse.data.items.map((video, index) => {
      const publishDate = new Date(video.snippet.publishedAt);
      const stats = videoStatsResponse.data.items[index]?.statistics || {};
      
      return {
        hour: publishDate.getHours(),
        day: publishDate.getDay(),
        engagement: (parseInt(stats.likeCount || 0) + parseInt(stats.commentCount || 0)),
        views: parseInt(stats.viewCount || 0)
      };
    });

    // Calculate hourly stats
    const hourlyData = Array(24).fill(0).map((_, hour) => {
      const uploads = uploadTimes.filter(time => time.hour === hour);
      const avgEngagement = uploads.length ? 
        Math.round(uploads.reduce((sum, up) => sum + up.engagement, 0) / uploads.length) : 0;
      
      return {
        hour,
        uploads: uploads.length,
        engagement: avgEngagement
      };
    });

    // Calculate daily stats
    const dailyData = Array(7).fill(0).map((_, day) => {
      const uploads = uploadTimes.filter(time => time.day === day);
      const avgEngagement = uploads.length ?
        Math.round(uploads.reduce((sum, up) => sum + up.engagement, 0) / uploads.length) : 0;
      
      return {
        day,
        uploads: uploads.length,
        engagement: avgEngagement
      };
    });

    // Find best times
    const bestHours = [...hourlyData]
      .filter(time => time.uploads > 0)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
      .map(time => ({
        ...time,
        engagement: time.engagement
      }));

    const bestDays = [...dailyData]
      .filter(day => day.uploads > 0)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3)
      .map(day => ({
        ...day,
        engagement: day.engagement
      }));

    // Peak activity times (when videos get the most views)
    const peakActivityHours = uploadTimes
      .map(upload => ({
        hour: upload.hour,
        views: upload.views
      }))
      .reduce((acc, curr) => {
        if (!acc[curr.hour]) acc[curr.hour] = { hour: curr.hour, totalViews: 0, count: 0 };
        acc[curr.hour].totalViews += curr.views;
        acc[curr.hour].count += 1;
        return acc;
      }, {});

    const peakHours = Object.values(peakActivityHours)
      .map(hour => ({
        hour: hour.hour,
        avgViews: Math.round(hour.totalViews / hour.count)
      }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 3);

    res.json({
      hourlyData,
      dailyData,
      bestHours,
      bestDays,
      peakHours,
      totalVideos: videoIds.length,
      analyzedDays: 90,
      recommendations: [
        {
          title: 'Best Upload Time',
          description: `Upload your videos at ${bestHours[0]?.hour}:00 to maximize engagement`
        },
        {
          title: 'Best Day',
          description: `${bestDays[0]?.day} shows the highest engagement rates`
        },
        {
          title: 'Peak Viewing Hours',
          description: `Your viewers are most active at ${peakHours[0]?.hour}:00`
        }
      ]
    });

  } catch (error) {
    console.error('Error analyzing best times:', error);
    res.status(500).json({
      message: 'Failed to analyze upload timing',
      error: error.message
    });
  }
};

export {
  connectYouTube,
  getProfile,
  getVideoMetadata,
  generateTranscription,
  generateVideoScript,
  disconnectYouTube,
  checkTrialStatus,
  getSubscriptionStatus,
  handleWebhook
};