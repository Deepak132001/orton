// server/src/services/content.service.js
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
Content: This is a sample post about your product or service.
Hashtags: #sample #content #instagram #marketing #social
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

// Rest of the content.service.js code remains the same...
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
        content: "This is a sample post about your product or service.",
        hashtags: ["sample", "content", "instagram", "marketing", "social"],
        type: contentType,
        engagementPrediction: 75,
      },
    ];
  }
};
