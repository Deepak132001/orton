// backend/src/controllers/content.controller.js
import { OpenAI } from 'openai';
import { User } from '../models/user.model.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get Instagram profile data
const getInstagramProfile = async (user) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
      {
        params: {
          fields: 'username,biography,followers_count,media_count',
          access_token: user.facebookAccessToken
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return null;
  }
};

// Helper function to get recent posts
const getRecentPosts = async (user) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
      {
        params: {
          fields: 'caption,media_type,like_count,comments_count,media_url',
          limit: 10,
          access_token: user.facebookAccessToken
        }
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
};

// Helper function to parse the generated content
const parseContentIdeas = (content) => {
  try {
    const sections = content.split('\n\n');
    const ideas = [];
    let currentIdea = {
      title: '',
      content: '',
      caption: '',
      hashtags: []
    };

    for (const section of sections) {
      const lowerSection = section.toLowerCase().trim();
      
      if (lowerSection.startsWith('title:')) {
        if (currentIdea.title) {
          ideas.push({...currentIdea});
          currentIdea = {
            title: '',
            content: '',
            caption: '',
            hashtags: []
          };
        }
        currentIdea.title = section.replace(/^title:\s*/i, '').trim();
      } else if (lowerSection.startsWith('caption:')) {
        currentIdea.caption = section.replace(/^caption:\s*/i, '').trim();
      } else if (lowerSection.startsWith('hashtags:') || section.includes('#')) {
        const hashtagMatches = section.match(/#[\w\u0590-\u05ff]+/g);
        if (hashtagMatches) {
          currentIdea.hashtags = hashtagMatches.map(tag => tag.slice(1));
        }
      } else if (section.trim()) {
        currentIdea.content += (currentIdea.content ? '\n\n' : '') + section.trim();
      }
    }

    if (currentIdea.title || currentIdea.content) {
      ideas.push(currentIdea);
    }

    return ideas;
  } catch (error) {
    console.error('Error parsing content:', error);
    return [{
      title: 'Content Generation',
      content: content,
      caption: '',
      hashtags: []
    }];
  }
};

// Helper function to create the prompt based on profile data
const createDetailedPrompt = async (contentType, user) => {
  const profileData = await getInstagramProfile(user);
  const recentPosts = await getRecentPosts(user);

  // Analyze recent posts for style and engagement
  const postAnalysis = recentPosts.length > 0 ? `
    Based on recent posts analysis:
    - Average engagement: ${recentPosts.reduce((sum, post) => sum + (post.like_count || 0) + (post.comments_count || 0), 0) / recentPosts.length} interactions
    - Popular content themes: ${recentPosts.slice(0, 3).map(post => post.caption?.slice(0, 30)).join(', ')}
    - Most engaging post type: ${getTopEngagingPostType(recentPosts)}
  ` : '';

  const accountContext = profileData ? `
    Creating content for Instagram account @${profileData.username}:
    - Followers: ${profileData.followers_count}
    - Account focus: ${profileData.biography}
    - Content style: Professional yet engaging
    ${postAnalysis}
  ` : '';

  const prompts = {
    'carousel': `Create a carousel post including:
      1. Title: Write a clear, attention-grabbing title
      2. Caption: Create an engaging caption (200-300 characters) that:
         - Matches the account's professional tone
         - Uses relevant emojis
         - Includes strategic line breaks
         - Ends with a strong call-to-action
      3. Content: Develop 4-5 key points for slides that:
         - Provide valuable insights
         - Maintain consistent branding
         - Follow a logical progression
      4. Hashtags: List 15-20 relevant hashtags grouped by:
         - Industry-specific (#business, #entrepreneurship)
         - Trending in your niche
         - Branded hashtags
         - Engagement hashtags`,

    'reel': `Create a reel post including:
      1. Title: Write a clear, attention-grabbing title
      2. Caption: Create an engaging caption (200-300 characters) that:
         - Matches the account's professional tone
         - Uses relevant emojis
         - Includes strategic line breaks
         - Ends with a strong call-to-action
      3. Content: 
         - Hook (first 3 seconds)
         - Script with timestamps
         - Music suggestions
         - Transition ideas
      4. Hashtags: List 15-20 trending hashtags grouped by:
         - Reel-specific (#reels, #instareels)
         - Niche-specific
         - Trending hashtags
         - Engagement hashtags`,

    'story': `Create a story sequence including:
      1. Title: Write a clear, attention-grabbing title
      2. Caption: Create an engaging caption (200-300 characters) that:
         - Is concise and impactful
         - Uses relevant emojis
         - Drives engagement
      3. Content:
         - Opening hook
         - Story frame sequence
         - Interactive elements (polls, questions)
         - CTA suggestions
      4. Hashtags: List 5-10 relevant hashtags`,

    'single': `Create a single post including:
      1. Title: Write a clear, attention-grabbing title
      2. Caption: Create an engaging caption (200-300 characters) that:
         - Matches the account's professional tone
         - Uses relevant emojis
         - Includes strategic line breaks
         - Ends with a strong call-to-action
      3. Content: Provide
         - Visual description
         - Key message
         - Engagement triggers
      4. Hashtags: List 15-20 relevant hashtags grouped by category`,

    'all': `Create versatile content including:
      1. Title: Write a clear, attention-grabbing title
      2. Caption: Create an engaging caption (200-300 characters) that:
         - Matches the account's professional tone
         - Uses relevant emojis
         - Includes strategic line breaks
         - Ends with a strong call-to-action
      3. Content: Key message and visual suggestions
      4. Hashtags: List 15-20 relevant hashtags grouped strategically`
  };

  return `${accountContext}

${prompts[contentType] || prompts.all}

Format each section clearly with "Title:", "Caption:", "Content:", and "Hashtags:".
Ensure the content aligns with the account's professional image while maintaining engagement.`;
};

// Helper function to determine top engaging post type
const getTopEngagingPostType = (posts) => {
  if (!posts.length) return 'mixed content';
  
  const engagementByType = posts.reduce((acc, post) => {
    const type = post.media_type?.toLowerCase() || 'unknown';
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    
    if (!acc[type]) {
      acc[type] = { count: 0, totalEngagement: 0 };
    }
    
    acc[type].count++;
    acc[type].totalEngagement += engagement;
    return acc;
  }, {});

  let topType = 'mixed content';
  let maxAvgEngagement = 0;

  Object.entries(engagementByType).forEach(([type, data]) => {
    const avgEngagement = data.totalEngagement / data.count;
    if (avgEngagement > maxAvgEngagement) {
      maxAvgEngagement = avgEngagement;
      topType = type;
    }
  });

  return topType;
};

// Main function to generate content
export const generateContent = async (req, res) => {
  try {
    const { contentType } = req.body;
    console.log('Generating content for type:', contentType);

    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected'
      });
    }

    const prompt = await createDetailedPrompt(contentType, user);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert Instagram content creator specializing in creating engaging, 
                   conversion-focused content with natural-sounding captions that use emojis effectively. 
                   Create content that balances professionalism with relatability.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const ideas = parseContentIdeas(completion.choices[0].message.content);
    
    const generatedContent = {
      id: Date.now().toString(),
      type: contentType,
      ideas: ideas
    };

    res.json(generatedContent);
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      message: 'Failed to generate content',
      error: error.message
    });
  }
};

// Function to get content suggestions
export const getContentSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected'
      });
    }

    const profileData = await getInstagramProfile(user);
    const recentPosts = await getRecentPosts(user);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an Instagram content strategist who provides detailed, actionable content suggestions."
        },
        {
          role: "user",
          content: `Based on this Instagram account (@${profileData?.username} with ${profileData?.followers_count} followers),
                   suggest 4 detailed content ideas that would engage their audience and maintain their style.
                   Recent post themes include: ${recentPosts.map(post => post.caption?.slice(0, 30)).join(', ')}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const ideas = parseContentIdeas(completion.choices[0].message.content);

    res.json({
      suggestions: ideas,
      accountInfo: {
        username: profileData?.username,
        followerCount: profileData?.followers_count,
        postCount: profileData?.media_count
      }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      message: 'Failed to get content suggestions',
      error: error.message
    });
  }
};

export const generateCustomContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Generating custom content for prompt:', prompt);

    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected'
      });
    }

    const profileData = await getInstagramProfile(user);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert Instagram content creator. Create content that matches the user's specific requirements while maintaining engagement and value.`
        },
        {
          role: "user",
          content: `For an Instagram account with ${profileData?.followers_count || 0} followers, create content based on this request: ${prompt}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const generatedContent = {
      id: Date.now().toString(),
      ideas: parseContentIdeas(completion.choices[0].message.content)
    };

    res.json(generatedContent);
  } catch (error) {
    console.error('Custom content generation error:', error);
    res.status(500).json({
      message: 'Failed to generate custom content',
      error: error.message
    });
  }
};