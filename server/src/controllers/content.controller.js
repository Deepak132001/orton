// backend/src/controllers/content.controller.js
import { OpenAI } from "openai";
import { User } from "../models/user.model.js";
import axios from "axios";
import dotenv from "dotenv";

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
          fields: "username,biography,followers_count,media_count",
          access_token: user.facebookAccessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
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
          fields: "caption,media_type,like_count,comments_count,media_url",
          limit: 10,
          access_token: user.facebookAccessToken,
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
};

// Helper function to parse the generated content
const parseContentIdeas = (content) => {
  try {
    const sections = content.split("\n\n");
    const ideas = [];
    let currentIdea = {
      title: "",
      content: "",
      caption: "",
      hashtags: [],
    };

    for (const section of sections) {
      const lowerSection = section.toLowerCase().trim();

      if (lowerSection.startsWith("title:")) {
        if (currentIdea.title) {
          ideas.push({ ...currentIdea });
          currentIdea = {
            title: "",
            content: "",
            caption: "",
            hashtags: [],
          };
        }
        currentIdea.title = section.replace(/^title:\s*/i, "").trim();
      } else if (lowerSection.startsWith("caption:")) {
        currentIdea.caption = section.replace(/^caption:\s*/i, "").trim();
      } else if (
        lowerSection.startsWith("hashtags:") ||
        section.includes("#")
      ) {
        const hashtagMatches = section.match(/#[\w\u0590-\u05ff]+/g);
        if (hashtagMatches) {
          currentIdea.hashtags = hashtagMatches.map((tag) => tag.slice(1));
        }
      } else if (section.trim()) {
        currentIdea.content +=
          (currentIdea.content ? "\n\n" : "") + section.trim();
      }
    }

    if (currentIdea.title || currentIdea.content) {
      ideas.push(currentIdea);
    }

    return ideas;
  } catch (error) {
    console.error("Error parsing content:", error);
    return [
      {
        title: "Content Generation",
        content: content,
        caption: "",
        hashtags: [],
      },
    ];
  }
};

// Helper function to create the prompt based on profile data
const createDetailedPrompt = async (contentType, user) => {
  const profileData = await getInstagramProfile(user);
  const recentPosts = await getRecentPosts(user);

  // Analyze recent posts for style and engagement
  const postAnalysis =
    recentPosts.length > 0
      ? `
    Based on recent posts analysis:
    - Average engagement: ${
      recentPosts.reduce(
        (sum, post) =>
          sum + (post.like_count || 0) + (post.comments_count || 0),
        0
      ) / recentPosts.length
    } interactions
    - Popular content themes: ${recentPosts
      .slice(0, 3)
      .map((post) => post.caption?.slice(0, 30))
      .join(", ")}
    - Most engaging post type: ${getTopEngagingPostType(recentPosts)}
  `
      : "";

  const accountContext = profileData
    ? `
    Creating content for Instagram account @${profileData.username}:
    - Followers: ${profileData.followers_count}
    - Account focus: ${profileData.biography}
    - Content style: Professional yet engaging
    ${postAnalysis}
  `
    : "";

  //   const prompts = {
  //     roast: `Generate a savage, no-mercy roast for the user based on their profile.
  // - Expose their laziness, delusions, or lack of effort.
  // - Use sarcasm, wit, and brutal honesty—no sugarcoating.
  // - End with a **cold reality check** that leaves them with no excuses.

  // Example Output:

  // "Oh, look who decided to take a break from doing absolutely nothing to show up here. You talk about 'grinding' but spend more time watching motivational reels than actually working. Your ‘big plans’ are just screenshots in your phone, collecting digital dust while you scroll mindlessly, convincing yourself that you’re ‘researching.’ You say you want success, but the only thing you’ve mastered is procrastination and blaming ‘bad luck’ for your own lack of discipline. Reality check: **No one is coming to save you. No one cares about your dreams until you make them real. Either put in the work or stay exactly where you are—stuck, broke, and watching others win.** Your move."`,
  //     carousel: `Create a carousel post including:
  //       1. Title: Write a clear, attention-grabbing title
  //       2. Caption: Create an engaging caption (200-300 characters) that:
  //          - Matches the account's professional tone
  //          - Uses relevant emojis
  //          - Includes strategic line breaks
  //          - Ends with a strong call-to-action
  //       3. Content: Develop 4-5 key points for slides that:
  //          - Provide valuable insights
  //          - Maintain consistent branding
  //          - Follow a logical progression
  //       4. Hashtags: List 15-20 relevant hashtags grouped by:
  //          - Industry-specific (#business, #entrepreneurship)
  //          - Trending in your niche
  //          - Branded hashtags
  //          - Engagement hashtags`,

  //     reel: `Create a reel post including:
  //       1. Title: Write a clear, attention-grabbing title
  //       2. Caption: Create an engaging caption (200-300 characters) that:
  //          - Matches the account's professional tone
  //          - Uses relevant emojis
  //          - Includes strategic line breaks
  //          - Ends with a strong call-to-action
  //       3. Content:
  //          - Hook (first 3 seconds)
  //          - Script with timestamps
  //          - Music suggestions
  //          - Transition ideas
  //       4. Hashtags: List 15-20 trending hashtags grouped by:
  //          - Reel-specific (#reels, #instareels)
  //          - Niche-specific
  //          - Trending hashtags
  //          - Engagement hashtags`,

  //     story: `Create a story sequence including:
  //       1. Title: Write a clear, attention-grabbing title
  //       2. Caption: Create an engaging caption (200-300 characters) that:
  //          - Is concise and impactful
  //          - Uses relevant emojis
  //          - Drives engagement
  //       3. Content:
  //          - Opening hook
  //          - Story frame sequence
  //          - Interactive elements (polls, questions)
  //          - CTA suggestions
  //       4. Hashtags: List 5-10 relevant hashtags`,

  //     single: `Create a single post including:
  //       1. Title: Write a clear, attention-grabbing title
  //       2. Caption: Create an engaging caption (200-300 characters) that:
  //          - Matches the account's professional tone
  //          - Uses relevant emojis
  //          - Includes strategic line breaks
  //          - Ends with a strong call-to-action
  //       3. Content: Provide
  //          - Visual description
  //          - Key message
  //          - Engagement triggers
  //       4. Hashtags: List 15-20 relevant hashtags grouped by category`,

  //     all: `Create versatile content including:
  //       1. Title: Write a clear, attention-grabbing title
  //       2. Caption: Create an engaging caption (200-300 characters) that:
  //          - Matches the account's professional tone
  //          - Uses relevant emojis
  //          - Includes strategic line breaks
  //          - Ends with a strong call-to-action
  //       3. Content: Key message and visual suggestions
  //       4. Hashtags: List 15-20 relevant hashtags grouped strategically`,
  //   };
  const prompts = {
    roast: `Generate a savage, no-mercy roast for the user based on their profile.  
- Expose their laziness, delusions, or lack of effort.  
- Use sarcasm, wit, and brutal honesty—no sugarcoating.  
- End with a **cold reality check** that leaves them with no excuses.  
- Bonus: Add a funny twist or a pun to lighten the mood.

Example Output:  

"Oh, look who decided to take a break from doing absolutely nothing to show up here. You talk about 'grinding' but spend more time watching motivational reels than actually working. Your ‘big plans’ are just screenshots in your phone, collecting digital dust while you scroll mindlessly, convincing yourself that you’re ‘researching.’ You say you want success, but the only thing you’ve mastered is procrastination and blaming ‘bad luck’ for your own lack of discipline. Reality check: **No one is coming to save you. No one cares about your dreams until you make them real. Either put in the work or stay exactly where you are—stuck, broke, and watching others win.** Your move. P.S. Your to-do list is starting to look like a historical document—ancient and untouched."`,

    carousel: `1. Title: Write a catchy, attention-grabbing title with humor.
     Example: "5 Ways to Adult Without Crying (Spoiler: You'll Still Cry)."

  2. Caption: Write a 200-300 character caption that includes:
     - Humor that matches the account's tone. Example: "Adulting is hard, but so is pretending you know what you're doing. Swipe for tips to fake it till you make it. 🎭 #Adulting101 #FakeItTillYouMakeIt."
     - Strategic line breaks for readability.
     - Relevant emojis to match the tone.
     - A strong call-to-action with a funny remark at the end. Example: "Ready to adult like a pro? Swipe right—or just cry in the fetal position. Your call. 😂."

  3. Content Breakdown:
     - Slide 1 - Introduction & Hook: 
        - Visuals: A fun, colorful image of someone drowning in paperwork or a cup of coffee spilled over a laptop.
        - Text Overlay: "Welcome to the adulting nightmare. It's okay, we've all been there."

     - Slide 2 - Step 1: Wake Up Like a Responsible Adult:
        - Visuals: Show a person trying to wake up early but hitting snooze on their alarm for the 8th time.
        - Text Overlay: "Step 1: Wake up early... if you can. Snooze button is your best friend."  

     - Slide 3 - Step 2: Pretend to Have Your Life Together:
        - Visuals: Show someone walking out of the house in a suit but with mismatched socks or spilling coffee on their shirt.
        - Text Overlay: "Step 2: Pretend you have it all together. No one will know the difference… until your coffee stains your shirt."  

     - Slide 4 - Step 3: Budgeting (But You're Just Here for the Memes):
        - Visuals: Show a person frantically looking at their bank statement while eating fast food.
        - Text Overlay: "Step 3: Budgeting. Just kidding, we all know you're here for the memes."  

     - Slide 5 - Step 4: Finally Adulting (Kind Of):
        - Visuals: Show someone finally making it through their day, exhausted but somewhat successful, sitting down with a glass of wine.
        - Text Overlay: "Step 4: You survived... sort of. Celebrate with wine and a good cry."
        - Call to Action: "Ready to adult like a pro? Swipe right—or just cry in the fetal position. Your call. 😂."

  4. Hashtags: Include 10-15 relevant hashtags, grouped by:
     - Industry-specific: #business #entrepreneurship #productivityhacks #adulting101 #lifehacks
     - Trending in your niche: #adultingfails #memesdaily #workhumor #adulthoodstruggles #funnycontent
     - Branded hashtags: #FakeItTillYouMakeIt #AdultingFails #SurvivingAdulting
     - Engagement hashtags: #SwipeRight #TagYourFriends #AdultingSucks #RelatableContent #LifeInTheChaos`,

    reel: `1. Title: Write a catchy, attention-grabbing title with humor.  
     Example: "When You Try to Be Productive but Netflix Says 'Not Today.'"
  
  2. Caption: Write a 200-300 character caption that includes:
     - Humor mixed with the account's tone. Example: "Me: I'll just watch one episode. Also me: 8 hours later Why is the sun coming up? 🌅 #ProcrastinationPro #NetflixAndChill."
     - Strategic line breaks for readability.  
     - Relevant emojis for tone.  
     - Strong call-to-action with humor at the end. Example: "Tag your favorite procrastination buddy below. Let's suffer together. 😂"

  3. Content Breakdown (Script with Timestamps):
     - 0:00-0:03 - Hook: Open with a funny or unexpected statement that grabs attention immediately. Example: "POV: You said you'd start your diet tomorrow… 3 years ago."
        - Visuals: Show a quick shot of you looking at your phone with a disgusted face as you scroll through an old "diet plan" app.  
        - Text Overlay/Voiceover: Text: "POV: 3 years later… still not dieting." 
        
     - 0:04-0:15 - Introduce the main problem with humor: Build on the initial hook with a humorous elaboration.  
        - Visuals: Show your messy workspace with snacks everywhere, a laptop open with a YouTube video paused mid-play.  
        - Text Overlay/Voiceover: Voiceover: "When you realize 'tomorrow' is just a myth, and the snacks are your true soulmate." 
        - Transition: Quick fade-out of the workspace scene to you opening a fridge.  

     - 0:16-0:45 - Build the story: Present a humorous step-by-step on how you "start" being productive (but fail).  
        - Visuals: You opening your laptop and just staring at it, looking confused.  
        - Text Overlay/Voiceover: Text: "Step 1: Open your laptop… Step 2: Just stare at it for 20 minutes…"  
        - Voiceover: "Step 3: Snack break. Because why do work when you can have pizza?" 
        - Transition: Quick cut to a close-up of you with a slice of pizza.  
        - Visual Cue: Zoom-in on the pizza slice with exaggerated slow-motion for comedic effect.  

     - 0:46-0:75 - Add the twist: Introduce a funny twist or punchline.  
        - Visuals: Show you eating the pizza, feeling victorious.  
        - Text Overlay/Voiceover: Voiceover: "Plot twist: The pizza was the goal all along."
        - Transition: Dramatic zoom-out with a slow-motion shot of you eating the pizza.  
        - Visual Cue: Add a quick flash of 'Success!' text in bold, animated font.  

     - 0:76-0:90 - End with a Call-to-Action: Finish strong with humor and a relatable comment.  
        - Visuals: Show a group of empty snack wrappers and you lying on the couch in an exaggerated relaxed position.  
        - Text Overlay/Voiceover: Text: "Productivity? More like snackivity."  
        - Voiceover: "Drop a 🍕 if you're also here for the snacks, not the productivity."  
        - Transition: Fade out with you laying down, snacking, and a text overlay saying "Call it a day."  

  4. Hashtags: Include 10-15 relevant hashtags, grouped by:
     - Reel-specific: #reels #instareels #funnyreels #reelsdaily #humorreels
     - Niche-specific: #ProductivityFails #ProcrastinationGoals #LazyDays #DietWho #SnackLife #NapKing
     - Trending hashtags: #NetflixAndChill #ProcrastinationPro #SnackAttack
     - Engagement hashtags: #TagYourBuddy #YouToo #LazyVibes`,

    story: `Create a story sequence with the following details:
    1. Title
   Write an attention-grabbing and humorous title.
   Example: "When Life Gives You Lemons… You Probably Forgot to Pay the Bills."

2. Caption
   Write a 200-300 character caption that includes:
   - Concise and impactful wording
   - Relevant emojis to match the tone
   - A call to engage the audience
   - A funny or playful remark/question at the end
   Example: "Swipe up if you've ever cried over a 2-for-1 pizza deal. 🍕 #Priorities."

3. Content Breakdown

   Opening Hook (Story 1)
   - Visual: Show a picture of a person staring at a phone or looking confused
   - Text Overlay: "POV: You're trying to explain crypto to your grandma."
   - CTA: Add a little arrow pointing to the next slide: "Next, we'll find out who's winning at life."
     
   Story Frame Sequence
   
   Story 2 - Frame 1 (Poll)
   - Visual: A shot of someone dramatically facepalming or rolling their eyes
   - Text Overlay: "Are you winning at life or just really good at faking it?"
   - Poll Options: "Winning at Life" vs. "Faking It"
   - Engagement Prompt: "Vote now and let's see if you're all living the dream or just surviving!"
     
   Story 3 - Frame 2 (Interactive Question)
   - Visual: A funny image of a stressed person with a mountain of coffee cups or a phone buzzing with endless notifications
   - Text Overlay: "What's your go-to life hack to get through the week?"
   - Question Sticker: "Drop your best hack below! 💡"
     
   Story 4 - Frame 3 (Would You Rather Poll)
   - Visual: A split screen image: one side shows a giant duck and the other shows a hundred tiny horses
   - Text Overlay: "Would you rather fight 1 horse-sized duck or 100 duck-sized horses? 🦆"
   - Poll Options: "Horse-Sized Duck" vs. "100 Duck-Sized Horses"
   - Engagement Prompt: "Pick wisely… you're probably gonna have to fight one of these one day."
     
   Story 5 - Final Frame (CTA)
   - Visual: A relaxing image of someone unwinding after a crazy day (like lying on the couch with snacks)
   - Text Overlay: "Tap to share your most embarrassing adulting fail. We promise not to judge… much."
   - CTA: "Let's hear it, what's the worst thing you've done while trying to be an adult?"

4. Hashtags
   Include 5-10 relevant hashtags, grouped by:
   
   Trending humor-related
   #AdultingStruggles #LifeFails #ProcrastinationProblems #FunnyMemes #RelatableContent
   
   Interactive
   #PollTime #VoteNow #InteractiveStories #QuestionOfTheDay
   
   Engagement
   #ShareYourStory #TellUsYourFail #SwipeUpToShare
    `,

    single: `Create a single post with the following details: 
    1. Title
   Write a clear, attention-grabbing title with a humorous twist.
   Example: "Why Coffee is the Only Reason I Function Before Noon."

2. Caption
   Create an engaging caption (200-300 characters) that:
   - Matches the account's professional tone but adds a dash of humor
   - Uses relevant emojis
   - Includes strategic line breaks
   - Ends with a strong call-to-action and a funny remark
   Example: "Coffee: Because adulting is hard, and sleep is for the weak. ☕ #CaffeineAddict #SurvivalMode."
   
   Call to Action: "Tag your coffee soulmate below. Let's caffeinate together. ❤️."

3. Content Breakdown
   
   Visual Description
   Suggest a funny or quirky visual.
   Example: "A mug that says 'But First, Coffee' with a face that says 'But Actually, Always Coffee.'"
     
   Key Message
   Include a light-hearted joke or pun.
   Example: "Coffee in hand, world domination in mind. Or at least making it to noon."
   
   Engagement Triggers
   Add a funny question or comment to spark engagement.
   Example: "What's your coffee order? Mine is 'whatever keeps me awake.'"

4. Hashtags
   List 10-15 relevant hashtags grouped by category.
   
   General Hashtags
   #CoffeeLover #MorningRitual #CaffeineAddict #SurvivalMode #CoffeeObsessed #CoffeeFirst #AdultingStruggles
   
   Engagement Hashtags
   #TagYourCoffeeBuddy #CoffeeTime #CaffeineFix
   
   Humor Hashtags
   #CoffeeHumor #FunnyPosts #MorningStruggles #CoffeeIsLife
    `
  };

  return `${accountContext}

${prompts[contentType] || prompts.all}

Format each section clearly with "Title:", "Caption:", "Content:", and "Hashtags:".
Ensure the content aligns with the account's professional image while maintaining engagement.`;
};

// Helper function to determine top engaging post type
const getTopEngagingPostType = (posts) => {
  if (!posts.length) return "mixed content";

  const engagementByType = posts.reduce((acc, post) => {
    const type = post.media_type?.toLowerCase() || "unknown";
    const engagement = (post.like_count || 0) + (post.comments_count || 0);

    if (!acc[type]) {
      acc[type] = { count: 0, totalEngagement: 0 };
    }

    acc[type].count++;
    acc[type].totalEngagement += engagement;
    return acc;
  }, {});

  let topType = "mixed content";
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
// export const generateContent = async (req, res) => {
//   try {
//     const { contentType } = req.body;
//     console.log("Generating content for type:", contentType);

//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: "Instagram account not connected",
//       });
//     }

//     const prompt = await createDetailedPrompt(contentType, user);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert Instagram content creator specializing in creating engaging, 
//                    conversion-focused content with natural-sounding captions that use emojis effectively. 
//                    Create content that balances professionalism with relatability.`,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.8,
//       max_tokens: 4000,
//     });

//     const ideas = parseContentIdeas(completion.choices[0].message.content);

//     const generatedContent = {
//       id: Date.now().toString(),
//       type: contentType,
//       ideas: ideas,
//     };

//     res.json(generatedContent);
//   } catch (error) {
//     console.error("Content generation error:", error);
//     res.status(500).json({
//       message: "Failed to generate content",
//       error: error.message,
//     });
//   }
// };
export const generateContent = async (req, res) => {
  try {
    const { contentType, modificationRequest, originalIdea } = req.body;
    console.log("Generating content for type:", contentType);

    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: "Instagram account not connected",
      });
    }

    let prompt;
    
    if (modificationRequest && originalIdea) {
      // Handle modification request
      prompt = `
        I have an existing social media content idea that needs modification:

        Original Idea:
        Title: ${originalIdea.title}
        Content: ${originalIdea.content}
        Caption: ${originalIdea.caption}
        Hashtags: ${originalIdea.hashtags.join(', ')}

        Modification Request: ${modificationRequest}

        Please provide an updated version of this content idea that incorporates these changes.
        Keep the same format with clear Title, Content, Caption, and Hashtags sections.
        Maintain the professional tone while addressing the requested changes.
      `;
    } else {
      // Handle new content generation
      prompt = await createDetailedPrompt(contentType, user);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert Instagram content creator specializing in creating engaging, 
                   conversion-focused content with natural-sounding captions that use emojis effectively. 
                   Create content that balances professionalism with relatability.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const ideas = parseContentIdeas(completion.choices[0].message.content);

    const generatedContent = {
      id: Date.now().toString(),
      type: contentType,
      ideas: ideas,
    };

    res.json(generatedContent);
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({
      message: "Failed to generate content",
      error: error.message,
    });
  }
};

// Function to get content suggestions
export const getContentSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: "Instagram account not connected",
      });
    }

    const profileData = await getInstagramProfile(user);
    const recentPosts = await getRecentPosts(user);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an Instagram content strategist who provides detailed, actionable content suggestions.",
        },
        {
          role: "user",
          content: `Based on this Instagram account (@${
            profileData?.username
          } with ${profileData?.followers_count} followers),
                   suggest 4 detailed content ideas that would engage their audience and maintain their style.
                   Recent post themes include: ${recentPosts
                     .map((post) => post.caption?.slice(0, 30))
                     .join(", ")}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const ideas = parseContentIdeas(completion.choices[0].message.content);

    res.json({
      suggestions: ideas,
      accountInfo: {
        username: profileData?.username,
        followerCount: profileData?.followers_count,
        postCount: profileData?.media_count,
      },
    });
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({
      message: "Failed to get content suggestions",
      error: error.message,
    });
  }
};

export const generateCustomContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Generating custom content for prompt:", prompt);

    const user = await User.findById(req.user._id);
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: "Instagram account not connected",
      });
    }

    const profileData = await getInstagramProfile(user);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert Instagram content creator. Create content that matches the user's specific requirements while maintaining engagement and value.`,
        },
        {
          role: "user",
          content: `For an Instagram account with ${
            profileData?.followers_count || 0
          } followers, create content based on this request: ${prompt}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const generatedContent = {
      id: Date.now().toString(),
      ideas: parseContentIdeas(completion.choices[0].message.content),
    };

    res.json(generatedContent);
  } catch (error) {
    console.error("Custom content generation error:", error);
    res.status(500).json({
      message: "Failed to generate custom content",
      error: error.message,
    });
  }
};
