// // server/src/services/content.service.js
// import OpenAI from "openai";
// import { analyzeBestPostingTimes } from "./posting.service.js";
// import dotenv from "dotenv";

// dotenv.config();

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Initialize OpenAI with error handling
// let openai;
// try {
//   if (!OPENAI_API_KEY) {
//     console.error(
//       "OpenAI API key is missing. Content generation features will be disabled."
//     );
//     // Provide mock data when API key is missing
//     openai = {
//       chat: {
//         completions: {
//           create: async () => ({
//             choices: [
//               {
//                 message: {
//                   content: `Title: Sample Content Idea
// Content: This is a sample post about your product or service.
// Hashtags: #sample #content #instagram #marketing #social
// Type: image`,
//                 },
//               },
//             ],
//           }),
//         },
//       },
//     };
//   } else {
//     openai = new OpenAI({
//       apiKey: OPENAI_API_KEY,
//     });
//   }
// } catch (error) {
//   console.error("Error initializing OpenAI:", error);
//   throw error;
// }

// // Rest of the content.service.js code remains the same...
// export const generateContentIdeas = async (
//   instagramBusinessId,
//   accessToken,
//   contentType
// ) => {
//   try {
//     // Get posting analytics to inform content generation
//     const analytics = await analyzeBestPostingTimes(
//       instagramBusinessId,
//       accessToken
//     );

//     // Prepare prompt based on analytics and content type
//     const prompt = createPromptFromAnalytics(analytics, contentType);

//     // Generate content using OpenAI
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert Instagram content strategist who creates engaging, trending content ideas.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     // Parse and format the response
//     const ideas = parseOpenAIResponse(completion.choices[0].message.content);

//     return ideas.map((idea) => ({
//       ...idea,
//       type: contentType,
//       engagementPrediction: calculateEngagementPrediction(idea, analytics),
//     }));
//   } catch (error) {
//     console.error("Error generating content ideas:", error);
//     // Return mock data in case of error
//     return [
//       {
//         id: "1",
//         title: "Sample Content Idea",
//         content: "This is a sample post about your product or service.",
//         hashtags: ["sample", "content", "instagram", "marketing", "social"],
//         type: contentType,
//         engagementPrediction: 75,
//       },
//     ];
//   }
// };

import OpenAI from "openai";
import { analyzeBestPostingTimes } from "./posting.service.js";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI with error handling
let openai;
try {
  if (!OPENAI_API_KEY) {
    console.error(
      "OpenAI API key is missing. Content generation features will be disabled."
    );
    // Provide mock data when API key is missing
    openai = {
      chat: {
        completions: {
          create: async () => ({
            choices: [
              {
                message: {
                  content: `Title: Sample Content Idea

Content:
• Main point 1: Key feature or benefit
• Main point 2: Supporting information
• Main point 3: Call to action

Caption:
Ready to transform your social media game? 🚀 Discover how our product can help you achieve amazing results! Click the link in bio to learn more. #socialmedia #marketing #growth

Hashtags: #sample #content #instagram #marketing #social #growth #socialmedia
Type: image`,
                },
              },
            ],
          }),
        },
      },
    };
  } else {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error("Error initializing OpenAI:", error);
  throw error;
}

const createPromptFromAnalytics = (analytics, contentType) => {
  return `Create an engaging Instagram ${contentType} post idea with the following sections:

1. Title: Create a clear, attention-grabbing title
2. Content: Provide detailed points or steps in bullet format
3. Caption: Write an engaging caption with emojis (200-300 characters)
4. Hashtags: List 5-7 relevant hashtags

Format the response with clear section headers (Title:, Content:, Caption:, Hashtags:).
Make the content informative, engaging, and optimized for Instagram.`;
};

const parseOpenAIResponse = (response) => {
  try {
    const sections = {};
    let currentSection = '';
    
    // Split response into lines and process each line
    response.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;
      
      // Check for section headers
      if (line.toLowerCase().startsWith('title:')) {
        currentSection = 'title';
        sections.title = line.substring(6).trim();
      } else if (line.toLowerCase().startsWith('content:')) {
        currentSection = 'content';
        sections.content = [];
      } else if (line.toLowerCase().startsWith('caption:')) {
        currentSection = 'caption';
        sections.caption = line.substring(8).trim();
      } else if (line.toLowerCase().startsWith('hashtags:')) {
        currentSection = 'hashtags';
        sections.hashtags = line
          .substring(9)
          .trim()
          .split(/[\s#]+/)
          .filter(tag => tag)
          .map(tag => tag.replace(/^#/, ''));
      } else {
        // Add content to current section
        if (currentSection === 'content') {
          sections.content.push(line);
        } else if (currentSection === 'caption' && !sections.caption) {
          sections.caption = line;
        }
      }
    });

    // Format content array into string if it exists
    if (sections.content && Array.isArray(sections.content)) {
      sections.content = sections.content.join('\n');
    }

    return [{
      id: Date.now().toString(),
      title: sections.title || 'Content Idea',
      content: sections.content || '',
      caption: sections.caption || '',
      hashtags: sections.hashtags || [],
    }];
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return [{
      id: Date.now().toString(),
      title: 'Content Idea',
      content: 'Error parsing content',
      caption: 'Error parsing caption',
      hashtags: ['error'],
    }];
  }
};

const calculateEngagementPrediction = (idea, analytics) => {
  // Simple mock engagement prediction
  return Math.floor(Math.random() * 30) + 70; // Returns 70-100
};

export const generateContentIdeas = async (
  instagramBusinessId,
  accessToken,
  contentType
) => {
  try {
    // Get posting analytics to inform content generation
    const analytics = await analyzeBestPostingTimes(
      instagramBusinessId,
      accessToken
    );

    // Prepare prompt based on analytics and content type
    const prompt = createPromptFromAnalytics(analytics, contentType);

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Instagram content strategist who creates engaging, trending content ideas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse and format the response
    const ideas = parseOpenAIResponse(completion.choices[0].message.content);

    return ideas.map((idea) => ({
      ...idea,
      type: contentType,
      engagementPrediction: calculateEngagementPrediction(idea, analytics),
    }));
  } catch (error) {
    console.error("Error generating content ideas:", error);
    // Return mock data in case of error
    return [
      {
        id: "1",
        title: "Sample Content Idea",
        content: "• Point 1: Key feature or benefit\n• Point 2: Supporting information\n• Point 3: Call to action",
        caption: "Ready to transform your social media game? 🚀 Discover how our product can help you achieve amazing results! Click the link in bio to learn more.",
        hashtags: ["sample", "content", "instagram", "marketing", "social"],
        type: contentType,
        engagementPrediction: 75,
      },
    ];
  }
};