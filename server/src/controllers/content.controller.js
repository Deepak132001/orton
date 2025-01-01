// // server/src/controllers/content.controller.js

// import { OpenAI } from 'openai';
// import { User } from '../models/user.model.js';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const parseContentIdeas = (content) => {
//   try {
//     const sections = content.split('\n\n');
//     const ideas = [];
//     let currentIdea = {
//       title: '',
//       content: '',
//       caption: '',
//       hashtags: []
//     };

//     for (const section of sections) {
//       const lowerSection = section.toLowerCase().trim();
      
//       if (lowerSection.startsWith('title:')) {
//         if (currentIdea.title) { // If we already have a title, start a new idea
//           ideas.push({...currentIdea});
//           currentIdea = {
//             title: '',
//             content: '',
//             caption: '',
//             hashtags: []
//           };
//         }
//         currentIdea.title = section.replace(/^title:\s*/i, '').trim();
//       } else if (lowerSection.startsWith('caption:')) {
//         currentIdea.caption = section.replace(/^caption:\s*/i, '').trim();
//       } else if (lowerSection.startsWith('hashtags:') || section.includes('#')) {
//         const hashtagMatches = section.match(/#[\w\u0590-\u05ff]+/g);
//         if (hashtagMatches) {
//           currentIdea.hashtags = hashtagMatches.map(tag => tag.slice(1));
//         }
//       } else if (section.trim()) {
//         currentIdea.content += (currentIdea.content ? '\n\n' : '') + section.trim();
//       }
//     }

//     // Add the last idea if it has content
//     if (currentIdea.title || currentIdea.content) {
//       ideas.push(currentIdea);
//     }

//     return ideas;
//   } catch (error) {
//     console.error('Error parsing content:', error);
//     return [{
//       title: 'Content Generation',
//       content: content,
//       caption: '',
//       hashtags: []
//     }];
//   }
// };

// // Define content type prompts at the top level
// const CONTENT_TYPE_PROMPTS = {
//   'carousel': `Create a comprehensive educational carousel post (6-8 slides) that provides in-depth value. Include:
//     1. An attention-grabbing title and hook
//     2. Detailed content for each slide (minimum 50 words per slide)
//     3. Supporting points and examples
//     4. Relevant statistics or data points
//     5. Visual description suggestions for each slide
//     6. A compelling call-to-action
//     7. Strategic hashtag groups (trending, niche, and branded)
//     8. Engagement prompts for comments`,

//   'single': `Create a high-impact single image post that includes:
//     1. A powerful visual concept description (composition, colors, mood)
//     2. A compelling main caption (minimum 200 words)
//     3. Story elements and hooks
//     4. Multiple call-to-action options
//     5. Strategic hashtag groups
//     6. Engagement questions
//     7. Tips for image styling and presentation`,

//   'reel': `Create a detailed 30-60 second reel script that includes:
//     1. Hook (first 3 seconds) - multiple options
//     2. Detailed scene-by-scene breakdown
//     3. Script with timing for each section
//     4. Visual transition suggestions
//     5. Music and sound effect recommendations
//     6. Text overlay suggestions
//     7. Multiple caption variations
//     8. Strategic hashtags
//     9. Engagement prompts`,

//   'story': `Create an engaging story sequence (5-7 frames) that includes:
//     1. Opening hook variations
//     2. Detailed content for each frame
//     3. Interactive element suggestions (polls, questions, sliders)
//     4. Visual styling recommendations
//     5. Sticker and GIF suggestions
//     6. Strategic call-to-actions
//     7. Swipe-up prompts (if applicable)
//     8. Follow-up story ideas`,

//   'all': `Create a comprehensive content piece that can be adapted across formats. Include:
//     1. Main topic and hook
//     2. Detailed content structure
//     3. Visual elements description
//     4. Engagement prompts
//     5. Call-to-action suggestions
//     6. Strategic hashtags
//     7. Performance metrics to track`
// };

// const getInstagramProfile = async (user) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
//       {
//         params: {
//           fields: 'username,biography,followers_count,media_count',
//           access_token: user.facebookAccessToken
//         }
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Instagram profile:', error);
//     return null;
//   }
// };

// const getRecentPosts = async (user) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
//       {
//         params: {
//           fields: 'caption,media_type,like_count,comments_count,media_url',
//           limit: 10,
//           access_token: user.facebookAccessToken
//         }
//       }
//     );
//     return response.data.data || [];
//   } catch (error) {
//     console.error('Error fetching recent posts:', error);
//     return [];
//   }
// };

// const createDetailedPrompt = (contentType, profileData, recentPosts) => {
//   const accountContext = profileData ? 
//     `This account (@${profileData.username}) has ${profileData.followers_count} followers and focuses on: ${profileData.biography}. ` : '';

//   const contentTypePrompts = {
//     'carousel': `Create 3 concise carousel post ideas (max 100 words each). Include:
//       1. Clear topic title
//       2. Brief description (2-3 sentences)
//       3. 3-4 key points to cover
//       4. 5 trending and relevant hashtags`,

//     'single': `Create 3 engaging single post ideas (max 100 words each). Include:
//       1. Clear topic title
//       2. Brief caption (2-3 sentences)
//       3. Visual description (1 sentence)
//       4. 5 trending and relevant hashtags`,

//     'reel': `Create 3 short reel ideas (max 100 words each). Include:
//       1. Clear topic title
//       2. Hook (1 sentence)
//       3. Main concept (2 sentences)
//       4. 5 trending and relevant hashtags`,

//     'story': `Create 3 story ideas (max 100 words each). Include:
//       1. Clear topic title
//       2. Content description (2-3 sentences)
//       3. Interactive element suggestion
//       4. 5 trending and relevant hashtags`,

//     'all': `Create 3 content ideas (max 100 words each) that can work across formats. Include:
//       1. Clear topic title
//       2. Main concept (2-3 sentences)
//       3. Key message
//       4. 5 trending and relevant hashtags`
//   };

//   const prompt = contentTypePrompts[contentType] || contentTypePrompts.all;

//   return `${accountContext}

// ${prompt}

// Make each idea concise, engaging, and easy to implement.
// Include only trending and highly relevant hashtags.
// Keep each idea's total length under 100 words.`;
// };

// export const generateContent = async (req, res) => {
//   try {
//     const { contentType } = req.body;
//     console.log('Generating content for type:', contentType);

//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: 'Instagram account not connected'
//       });
//     }

//     const profileData = await getInstagramProfile(user);
//     const recentPosts = await getRecentPosts(user);
//     const prompt = createDetailedPrompt(contentType, profileData, recentPosts);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are a concise Instagram content strategist. Create brief, engaging content ideas that are easy to implement.`
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.8,
//       max_tokens: 1000
//     });

//     const generatedContent = {
//       id: Date.now().toString(),
//       type: contentType,
//       ideas: parseContentIdeas(completion.choices[0].message.content)
//     };

//     res.json(generatedContent);
//   } catch (error) {
//     console.error('Content generation error:', error);
//     res.status(500).json({
//       message: 'Failed to generate content',
//       error: error.message
//     });
//   }
// };

// const extractHashtags = (content) => {
//   const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
//   const matches = content.match(hashtagRegex) || [];
//   return matches.map(tag => tag.slice(1)); // Remove # symbol
// };

// export const getContentSuggestions = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const suggestions = await generateSuggestions(user);
//     res.json(suggestions);
//   } catch (error) {
//     console.error('Get suggestions error:', error);
//     res.status(500).json({
//       message: 'Failed to get content suggestions',
//       error: error.message
//     });
//   }
// };

// const generateSuggestions = async (user) => {
//   try {
//     const profileData = await getInstagramProfile(user);
//     const recentPosts = await getRecentPosts(user);

//     const prompt = `Based on this Instagram account (@${profileData?.username} with ${profileData?.followers_count} followers),
//                    suggest 4 detailed content ideas that would engage their audience and maintain their style.
//                    Recent post themes include: ${recentPosts.map(post => post.caption?.slice(0, 30)).join(', ')}`;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: "You are an Instagram content strategist who provides detailed, actionable content suggestions."
//         },
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.8,
//       max_tokens: 2000
//     });

//     return parseSuggestions(completion.choices[0].message.content);
//   } catch (error) {
//     console.error('Error generating suggestions:', error);
//     return [];
//   }
// };

// const parseSuggestions = (content) => {
//   const suggestions = content.split(/\d+\./).filter(Boolean);
//   return suggestions.map((suggestion, index) => ({
//     id: Date.now() + index,
//     title: suggestion.split('\n')[0].trim(),
//     content: suggestion.trim(),
//     hashtags: extractHashtags(suggestion),
//     type: 'suggestion'
//   }));
// };
// // const parseContentIdeas = (content) => {
// //   const ideas = content.split(/\d+\.\s+/).filter(Boolean);
// //   return ideas.map((idea, index) => {
// //     const sections = idea.split('\n').filter(Boolean);
// //     const hashtagSection = sections.find(s => s.includes('#')) || '';
// //     const hashtags = hashtagSection.match(/#[\w\u0590-\u05ff]+/g) || [];

// //     return {
// //       id: Date.now() + index,
// //       title: sections[0].trim(),
// //       content: sections.filter(s => !s.includes('#')).join('\n').trim(),
// //       hashtags: hashtags.map(tag => tag.slice(1))
// //     };
// //   });
// // };

// export const generateCustomContent = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     console.log('Generating custom content for prompt:', prompt);

//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: 'Instagram account not connected'
//       });
//     }

//     const profileData = await getInstagramProfile(user);
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert Instagram content creator. Create content that matches the user's specific requirements while maintaining engagement and value.`
//         },
//         {
//           role: "user",
//           content: `For an Instagram account with ${profileData?.followers_count || 0} followers, create content based on this request: ${prompt}`
//         }
//       ],
//       temperature: 0.8,
//       max_tokens: 1000
//     });

//     const generatedContent = {
//       id: Date.now().toString(),
//       ideas: parseContentIdeas(completion.choices[0].message.content)
//     };

//     res.json(generatedContent);
//   } catch (error) {
//     console.error('Custom content generation error:', error);
//     res.status(500).json({
//       message: 'Failed to generate custom content',
//       error: error.message
//     });
//   }
// };

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