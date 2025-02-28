// // backend/src/controllers/content.controller.js
// import { OpenAI } from "openai";
// import { User } from "../models/user.model.js";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Helper function to get Instagram profile data
// const getInstagramProfile = async (user) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
//       {
//         params: {
//           fields: "username,biography,followers_count,media_count",
//           access_token: user.facebookAccessToken,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching Instagram profile:", error);
//     return null;
//   }
// };

// // Helper function to get recent posts
// const getRecentPosts = async (user) => {
//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
//       {
//         params: {
//           fields: "caption,media_type,like_count,comments_count,media_url",
//           limit: 10,
//           access_token: user.facebookAccessToken,
//         },
//       }
//     );
//     return response.data.data || [];
//   } catch (error) {
//     console.error("Error fetching recent posts:", error);
//     return [];
//   }
// };

// // Helper function to parse the generated content
// const parseContentIdeas = (content) => {
//   try {
//     const sections = content.split("\n\n");
//     const ideas = [];
//     let currentIdea = {
//       title: "",
//       content: "",
//       caption: "",
//       hashtags: [],
//     };

//     for (const section of sections) {
//       const lowerSection = section.toLowerCase().trim();

//       if (lowerSection.startsWith("title:")) {
//         if (currentIdea.title) {
//           ideas.push({ ...currentIdea });
//           currentIdea = {
//             title: "",
//             content: "",
//             caption: "",
//             hashtags: [],
//           };
//         }
//         currentIdea.title = section.replace(/^title:\s*/i, "").trim();
//       } else if (lowerSection.startsWith("caption:")) {
//         currentIdea.caption = section.replace(/^caption:\s*/i, "").trim();
//       } else if (
//         lowerSection.startsWith("hashtags:") ||
//         section.includes("#")
//       ) {
//         const hashtagMatches = section.match(/#[\w\u0590-\u05ff]+/g);
//         if (hashtagMatches) {
//           currentIdea.hashtags = hashtagMatches.map((tag) => tag.slice(1));
//         }
//       } else if (section.trim()) {
//         currentIdea.content +=
//           (currentIdea.content ? "\n\n" : "") + section.trim();
//       }
//     }

//     if (currentIdea.title || currentIdea.content) {
//       ideas.push(currentIdea);
//     }

//     return ideas;
//   } catch (error) {
//     console.error("Error parsing content:", error);
//     return [
//       {
//         title: "Content Generation",
//         content: content,
//         caption: "",
//         hashtags: [],
//       },
//     ];
//   }
// };

// // Helper function to create the prompt based on profile data
// const createDetailedPrompt = async (contentType, user) => {
//   const profileData = await getInstagramProfile(user);
//   const recentPosts = await getRecentPosts(user);
//   const reelDurations = [15, 30, 45, 60, 90];  
//   const reelTime = reelDurations[Math.floor(Math.random() * reelDurations.length)];  

//   // Analyze recent posts for style and engagement
//   const postAnalysis =
//     recentPosts.length > 0
//       ? `
//     Based on recent posts analysis:
//     - Average engagement: ${
//       recentPosts.reduce(
//         (sum, post) =>
//           sum + (post.like_count || 0) + (post.comments_count || 0),
//         0
//       ) / recentPosts.length
//     } interactions
//     - Popular content themes: ${recentPosts
//       .slice(0, 3)
//       .map((post) => post.caption?.slice(0, 30))
//       .join(", ")}
//     - Most engaging post type: ${getTopEngagingPostType(recentPosts)}
//   `
//       : "";

//   const accountContext = profileData
//     ? `
//     Creating content for Instagram account @${profileData.username}:
//     - Followers: ${profileData.followers_count}
//     - Account focus: ${profileData.biography}
//     - Content style: Professional yet engaging
//     ${postAnalysis}
//   `
//     : "";

//   const prompts = {
//     roast: `Generate a savage, no-mercy roast for the user based on their profile.
//   - Expose their laziness, delusions, or lack of effort.
//   - Use sarcasm, wit, and brutal honesty—no sugarcoating.
//   - End with a **cold reality check** that leaves them with no excuses.

//   Example Output:

//   "Oh, look who decided to take a break from doing absolutely nothing to show up here. You talk about 'grinding' but spend more time watching motivational reels than actually working. Your ‘big plans’ are just screenshots in your phone, collecting digital dust while you scroll mindlessly, convincing yourself that you’re ‘researching.’ You say you want success, but the only thing you’ve mastered is procrastination and blaming ‘bad luck’ for your own lack of discipline. Reality check: **No one is coming to save you. No one cares about your dreams until you make them real. Either put in the work or stay exactly where you are—stuck, broke, and watching others win.** Your move."`,
//     carousel: `1. Title: Write a catchy, attention-grabbing title with humor.
//      Example: "5 Ways to Adult Without Crying (Spoiler: You'll Still Cry)."

//   2. Caption: Write a 200-300 character caption that includes:
//      - Humor that matches the account's tone. Example: "Adulting is hard, but so is pretending you know what you're doing. Swipe for tips to fake it till you make it. 🎭 #Adulting101 #FakeItTillYouMakeIt."
//      - Strategic line breaks for readability.
//      - Relevant emojis to match the tone.
//      - A strong call-to-action with a funny remark at the end. Example: "Ready to adult like a pro? Swipe right—or just cry in the fetal position. Your call. 😂."

//   3. Content Breakdown:
//      - Slide 1 - Introduction & Hook: 
//         - Visuals: A fun, colorful image of someone drowning in paperwork or a cup of coffee spilled over a laptop.
//         - Text Overlay: "Welcome to the adulting nightmare. It's okay, we've all been there."

//      - Slide 2 - Step 1: Wake Up Like a Responsible Adult:
//         - Visuals: Show a person trying to wake up early but hitting snooze on their alarm for the 8th time.
//         - Text Overlay: "Step 1: Wake up early... if you can. Snooze button is your best friend."  

//      - Slide 3 - Step 2: Pretend to Have Your Life Together:
//         - Visuals: Show someone walking out of the house in a suit but with mismatched socks or spilling coffee on their shirt.
//         - Text Overlay: "Step 2: Pretend you have it all together. No one will know the difference… until your coffee stains your shirt."  

//      - Slide 4 - Step 3: Budgeting (But You're Just Here for the Memes):
//         - Visuals: Show a person frantically looking at their bank statement while eating fast food.
//         - Text Overlay: "Step 3: Budgeting. Just kidding, we all know you're here for the memes."  

//      - Slide 5 - Step 4: Finally Adulting (Kind Of):
//         - Visuals: Show someone finally making it through their day, exhausted but somewhat successful, sitting down with a glass of wine.
//         - Text Overlay: "Step 4: You survived... sort of. Celebrate with wine and a good cry."
//         - Call to Action: "Ready to adult like a pro? Swipe right—or just cry in the fetal position. Your call. 😂."

//   4. Hashtags: Include 10-15 relevant hashtags, grouped by:
//      - Industry-specific: #business #entrepreneurship #productivityhacks #adulting101 #lifehacks
//      - Trending in your niche: #adultingfails #memesdaily #workhumor #adulthoodstruggles #funnycontent
//      - Branded hashtags: #FakeItTillYouMakeIt #AdultingFails #SurvivingAdulting
//      - Engagement hashtags: #SwipeRight #TagYourFriends #AdultingSucks #RelatableContent #LifeInTheChaos`,

//   //   reel: `1. Title: Write a catchy, attention-grabbing title with humor.  
//   //    Example: "When You Try to Be Productive but Netflix Says 'Not Today.'"
  
//   // 2. Caption: Write a 200-300 character caption that includes:
//   //    - Humor mixed with the account's tone. Example: "Me: I'll just watch one episode. Also me: 8 hours later Why is the sun coming up? 🌅 #ProcrastinationPro #NetflixAndChill."
//   //    - Strategic line breaks for readability.  
//   //    - Relevant emojis for tone.  
//   //    - Strong call-to-action with humor at the end. Example: "Tag your favorite procrastination buddy below. Let's suffer together. 😂"

//   // 3. Content Breakdown (Script with Timestamps):
//   //    - 0:00-0:03 - Hook: Open with a funny or unexpected statement that grabs attention immediately. Example: "POV: You said you'd start your diet tomorrow… 3 years ago."
//   //       - Visuals: Show a quick shot of you looking at your phone with a disgusted face as you scroll through an old "diet plan" app.  
//   //       - Text Overlay/Voiceover: Text: "POV: 3 years later… still not dieting." 
        
//   //    - 0:04-0:15 - Introduce the main problem with humor: Build on the initial hook with a humorous elaboration.  
//   //       - Visuals: Show your messy workspace with snacks everywhere, a laptop open with a YouTube video paused mid-play.  
//   //       - Text Overlay/Voiceover: Voiceover: "When you realize 'tomorrow' is just a myth, and the snacks are your true soulmate." 
//   //       - Transition: Quick fade-out of the workspace scene to you opening a fridge.  

//   //    - 0:16-0:45 - Build the story: Present a humorous step-by-step on how you "start" being productive (but fail).  
//   //       - Visuals: You opening your laptop and just staring at it, looking confused.  
//   //       - Text Overlay/Voiceover: Text: "Step 1: Open your laptop… Step 2: Just stare at it for 20 minutes…"  
//   //       - Voiceover: "Step 3: Snack break. Because why do work when you can have pizza?" 
//   //       - Transition: Quick cut to a close-up of you with a slice of pizza.  
//   //       - Visual Cue: Zoom-in on the pizza slice with exaggerated slow-motion for comedic effect.  

//   //    - 0:46-0:75 - Add the twist: Introduce a funny twist or punchline.  
//   //       - Visuals: Show you eating the pizza, feeling victorious.  
//   //       - Text Overlay/Voiceover: Voiceover: "Plot twist: The pizza was the goal all along."
//   //       - Transition: Dramatic zoom-out with a slow-motion shot of you eating the pizza.  
//   //       - Visual Cue: Add a quick flash of 'Success!' text in bold, animated font.  

//   //    - 0:76-0:90 - End with a Call-to-Action: Finish strong with humor and a relatable comment.  
//   //       - Visuals: Show a group of empty snack wrappers and you lying on the couch in an exaggerated relaxed position.  
//   //       - Text Overlay/Voiceover: Text: "Productivity? More like snackivity."  
//   //       - Voiceover: "Drop a 🍕 if you're also here for the snacks, not the productivity."  
//   //       - Transition: Fade out with you laying down, snacking, and a text overlay saying "Call it a day."  

//   // 4. Hashtags: Include 10-15 relevant hashtags, grouped by:
//   //    - Reel-specific: #reels #instareels #funnyreels #reelsdaily #humorreels
//   //    - Niche-specific: #ProductivityFails #ProcrastinationGoals #LazyDays #DietWho #SnackLife #NapKing
//   //    - Trending hashtags: #NetflixAndChill #ProcrastinationPro #SnackAttack
//   //    - Engagement hashtags: #TagYourBuddy #YouToo #LazyVibes`,
  
  
//   reel: `1. Title: Write a catchy, attention-grabbing title with humor.  
//        Example: "When You Try to Be Productive but Netflix Says 'Not Today.'"  
  
//     2. Caption: Write a 200-300 character caption that includes:  
//        - Humor mixed with the account's tone. Example: "Me: I'll just watch one episode. Also me: 8 hours later Why is the sun coming up? 🌅 #ProcrastinationPro #NetflixAndChill."  
//        - Strategic line breaks for readability.  
//        - Relevant emojis for tone.  
//        - Strong call-to-action with humor at the end. Example: "Tag your favorite procrastination buddy below. Let's suffer together. 😂"  
  
//     3. Content Breakdown (Script with Timestamps):  
  
//        - 0:00-0:03 - Hook: Open with a funny or unexpected statement that grabs attention immediately.  
//           - Visuals: Show a quick shot of you looking at your phone with a disgusted face as you scroll through an old "diet plan" app.  
//           - Text Overlay/Voiceover: Text: "POV: 3 years later… still not dieting."  
  
//        - 0:04-${Math.min(0.2 * reelTime, 15).toFixed(2)} - Introduce the main problem with humor: Build on the initial hook with a humorous elaboration.  
//           - Visuals: Show your messy workspace with snacks everywhere, a laptop open with a YouTube video paused mid-play.  
//           - Text Overlay/Voiceover: Voiceover: "When you realize 'tomorrow' is just a myth, and the snacks are your true soulmate."  
//           - Transition: Quick fade-out of the workspace scene to you opening a fridge.  
  
//        - ${Math.min(0.2 * reelTime, 15).toFixed(2)}-${Math.min(0.5 * reelTime, 45).toFixed(2)} - Build the story: Present a humorous step-by-step on how you "start" being productive (but fail).  
//           - Visuals: You opening your laptop and just staring at it, looking confused.  
//           - Text Overlay/Voiceover: Text: "Step 1: Open your laptop… Step 2: Just stare at it for 20 minutes…"  
//           - Voiceover: "Step 3: Snack break. Because why do work when you can have pizza?"  
//           - Transition: Quick cut to a close-up of you with a slice of pizza.  
//           - Visual Cue: Zoom-in on the pizza slice with exaggerated slow-motion for comedic effect.  
  
//        - ${Math.min(0.5 * reelTime, 45).toFixed(2)}-${Math.min(0.85 * reelTime, 75).toFixed(2)} - Add the twist: Introduce a funny twist or punchline.  
//           - Visuals: Show you eating the pizza, feeling victorious.  
//           - Text Overlay/Voiceover: Voiceover: "Plot twist: The pizza was the goal all along."  
//           - Transition: Dramatic zoom-out with a slow-motion shot of you eating the pizza.  
//           - Visual Cue: Add a quick flash of 'Success!' text in bold, animated font.  
  
//        - ${Math.min(0.85 * reelTime, 75).toFixed(2)}-${reelTime} - End with a Call-to-Action: Finish strong with humor and a relatable comment.  
//           - Visuals: Show a group of empty snack wrappers and you lying on the couch in an exaggerated relaxed position.  
//           - Text Overlay/Voiceover: Text: "Productivity? More like snackivity."  
//           - Voiceover: "Drop a 🍕 if you're also here for the snacks, not the productivity."  
//           - Transition: Fade out with you laying down, snacking, and a text overlay saying "Call it a day."  
  
//     4. Hashtags: Include 10-15 relevant hashtags, grouped by:  
//        - Reel-specific: #reels #instareels #funnyreels #reelsdaily #humorreels  
//        - Niche-specific: #ProductivityFails #ProcrastinationGoals #LazyDays #DietWho #SnackLife #NapKing  
//        - Trending hashtags: #NetflixAndChill #ProcrastinationPro #SnackAttack  
//        - Engagement hashtags: #TagYourBuddy #YouToo #LazyVibes`,
  

//     story: `Create a story sequence with the following details:
//     1. Title
//    Write an attention-grabbing and humorous title.
//    Example: "When Life Gives You Lemons… You Probably Forgot to Pay the Bills."

// 2. Caption
//    Write a 200-300 character caption that includes:
//    - Concise and impactful wording
//    - Relevant emojis to match the tone
//    - A call to engage the audience
//    - A funny or playful remark/question at the end
//    Example: "Swipe up if you've ever cried over a 2-for-1 pizza deal. 🍕 #Priorities."

// 3. Content Breakdown

//    Opening Hook (Story 1)
//    - Visual: Show a picture of a person staring at a phone or looking confused
//    - Text Overlay: "POV: You're trying to explain crypto to your grandma."
//    - CTA: Add a little arrow pointing to the next slide: "Next, we'll find out who's winning at life."
     
//    Story Frame Sequence
   
//    Story 2 - Frame 1 (Poll)
//    - Visual: A shot of someone dramatically facepalming or rolling their eyes
//    - Text Overlay: "Are you winning at life or just really good at faking it?"
//    - Poll Options: "Winning at Life" vs. "Faking It"
//    - Engagement Prompt: "Vote now and let's see if you're all living the dream or just surviving!"
     
//    Story 3 - Frame 2 (Interactive Question)
//    - Visual: A funny image of a stressed person with a mountain of coffee cups or a phone buzzing with endless notifications
//    - Text Overlay: "What's your go-to life hack to get through the week?"
//    - Question Sticker: "Drop your best hack below! 💡"
     
//    Story 4 - Frame 3 (Would You Rather Poll)
//    - Visual: A split screen image: one side shows a giant duck and the other shows a hundred tiny horses
//    - Text Overlay: "Would you rather fight 1 horse-sized duck or 100 duck-sized horses? 🦆"
//    - Poll Options: "Horse-Sized Duck" vs. "100 Duck-Sized Horses"
//    - Engagement Prompt: "Pick wisely… you're probably gonna have to fight one of these one day."
     
//    Story 5 - Final Frame (CTA)
//    - Visual: A relaxing image of someone unwinding after a crazy day (like lying on the couch with snacks)
//    - Text Overlay: "Tap to share your most embarrassing adulting fail. We promise not to judge… much."
//    - CTA: "Let's hear it, what's the worst thing you've done while trying to be an adult?"

// 4. Hashtags
//    Include 5-10 relevant hashtags, grouped by:
   
//    Trending humor-related
//    #AdultingStruggles #LifeFails #ProcrastinationProblems #FunnyMemes #RelatableContent
   
//    Interactive
//    #PollTime #VoteNow #InteractiveStories #QuestionOfTheDay
   
//    Engagement
//    #ShareYourStory #TellUsYourFail #SwipeUpToShare
//     `,

//     single: `Create a single post with the following details: 
//     1. Title
//    Write a clear, attention-grabbing title with a humorous twist.
//    Example: "Why Coffee is the Only Reason I Function Before Noon."

// 2. Caption
//    Create an engaging caption (200-300 characters) that:
//    - Matches the account's professional tone but adds a dash of humor
//    - Uses relevant emojis
//    - Includes strategic line breaks
//    - Ends with a strong call-to-action and a funny remark
//    Example: "Coffee: Because adulting is hard, and sleep is for the weak. ☕ #CaffeineAddict #SurvivalMode."
   
//    Call to Action: "Tag your coffee soulmate below. Let's caffeinate together. ❤️."

// 3. Content Breakdown
   
//    Visual Description
//    Suggest a funny or quirky visual.
//    Example: "A mug that says 'But First, Coffee' with a face that says 'But Actually, Always Coffee.'"
     
//    Key Message
//    Include a light-hearted joke or pun.
//    Example: "Coffee in hand, world domination in mind. Or at least making it to noon."
   
//    Engagement Triggers
//    Add a funny question or comment to spark engagement.
//    Example: "What's your coffee order? Mine is 'whatever keeps me awake.'"

// 4. Hashtags
//    List 10-15 relevant hashtags grouped by category.
   
//    General Hashtags
//    #CoffeeLover #MorningRitual #CaffeineAddict #SurvivalMode #CoffeeObsessed #CoffeeFirst #AdultingStruggles
   
//    Engagement Hashtags
//    #TagYourCoffeeBuddy #CoffeeTime #CaffeineFix
   
//    Humor Hashtags
//    #CoffeeHumor #FunnyPosts #MorningStruggles #CoffeeIsLife
//     `
//   };

//   return `${accountContext}

// ${prompts[contentType] || prompts.all}

// Format each section clearly with "Title:", "Caption:", "Content:", and "Hashtags:".
// Ensure the content aligns with the account's professional image while maintaining engagement.`;
// };

// // Helper function to determine top engaging post type
// const getTopEngagingPostType = (posts) => {
//   if (!posts.length) return "mixed content";

//   const engagementByType = posts.reduce((acc, post) => {
//     const type = post.media_type?.toLowerCase() || "unknown";
//     const engagement = (post.like_count || 0) + (post.comments_count || 0);

//     if (!acc[type]) {
//       acc[type] = { count: 0, totalEngagement: 0 };
//     }

//     acc[type].count++;
//     acc[type].totalEngagement += engagement;
//     return acc;
//   }, {});

//   let topType = "mixed content";
//   let maxAvgEngagement = 0;

//   Object.entries(engagementByType).forEach(([type, data]) => {
//     const avgEngagement = data.totalEngagement / data.count;
//     if (avgEngagement > maxAvgEngagement) {
//       maxAvgEngagement = avgEngagement;
//       topType = type;
//     }
//   });

//   return topType;
// };

// // Main function to generate content
// // export const generateContent = async (req, res) => {
// //   try {
// //     const { contentType } = req.body;
// //     console.log("Generating content for type:", contentType);

// //     const user = await User.findById(req.user._id);
// //     if (!user.instagramBusinessId || !user.facebookAccessToken) {
// //       return res.status(400).json({
// //         message: "Instagram account not connected",
// //       });
// //     }

// //     const prompt = await createDetailedPrompt(contentType, user);

// //     const completion = await openai.chat.completions.create({
// //       model: "gpt-4",
// //       messages: [
// //         {
// //           role: "system",
// //           content: `You are an expert Instagram content creator specializing in creating engaging, 
// //                    conversion-focused content with natural-sounding captions that use emojis effectively. 
// //                    Create content that balances professionalism with relatability.`,
// //         },
// //         {
// //           role: "user",
// //           content: prompt,
// //         },
// //       ],
// //       temperature: 0.8,
// //       max_tokens: 4000,
// //     });

// //     const ideas = parseContentIdeas(completion.choices[0].message.content);

// //     const generatedContent = {
// //       id: Date.now().toString(),
// //       type: contentType,
// //       ideas: ideas,
// //     };

// //     res.json(generatedContent);
// //   } catch (error) {
// //     console.error("Content generation error:", error);
// //     res.status(500).json({
// //       message: "Failed to generate content",
// //       error: error.message,
// //     });
// //   }
// // };
// export const generateContent = async (req, res) => {
//   try {
//     const { contentType, modificationRequest, originalIdea } = req.body;
//     console.log("Generating content for type:", contentType);

//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: "Instagram account not connected",
//       });
//     }

//     let prompt;
    
//     if (modificationRequest && originalIdea) {
//       // Handle modification request
//       prompt = `
//         I have an existing social media content idea that needs modification:

//         Original Idea:
//         Title: ${originalIdea.title}
//         Content: ${originalIdea.content}
//         Caption: ${originalIdea.caption}
//         Hashtags: ${originalIdea.hashtags.join(', ')}

//         Modification Request: ${modificationRequest}

//         Please provide an updated version of this content idea that incorporates these changes.
//         Keep the same format with clear Title, Content, Caption, and Hashtags sections.
//         Maintain the professional tone while addressing the requested changes.
//       `;
//     } else {
//       // Handle new content generation
//       prompt = await createDetailedPrompt(contentType, user);
//     }

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

// // Function to get content suggestions
// export const getContentSuggestions = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: "Instagram account not connected",
//       });
//     }

//     const profileData = await getInstagramProfile(user);
//     const recentPosts = await getRecentPosts(user);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an Instagram content strategist who provides detailed, actionable content suggestions.",
//         },
//         {
//           role: "user",
//           content: `Based on this Instagram account (@${
//             profileData?.username
//           } with ${profileData?.followers_count} followers),
//                    suggest 4 detailed content ideas that would engage their audience and maintain their style.
//                    Recent post themes include: ${recentPosts
//                      .map((post) => post.caption?.slice(0, 30))
//                      .join(", ")}`,
//         },
//       ],
//       temperature: 0.8,
//       max_tokens: 4000,
//     });

//     const ideas = parseContentIdeas(completion.choices[0].message.content);

//     res.json({
//       suggestions: ideas,
//       accountInfo: {
//         username: profileData?.username,
//         followerCount: profileData?.followers_count,
//         postCount: profileData?.media_count,
//       },
//     });
//   } catch (error) {
//     console.error("Get suggestions error:", error);
//     res.status(500).json({
//       message: "Failed to get content suggestions",
//       error: error.message,
//     });
//   }
// };

// export const generateCustomContent = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     console.log("Generating custom content for prompt:", prompt);

//     const user = await User.findById(req.user._id);
//     if (!user.instagramBusinessId || !user.facebookAccessToken) {
//       return res.status(400).json({
//         message: "Instagram account not connected",
//       });
//     }

//     const profileData = await getInstagramProfile(user);
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert Instagram content creator. Create content that matches the user's specific requirements while maintaining engagement and value.`,
//         },
//         {
//           role: "user",
//           content: `For an Instagram account with ${
//             profileData?.followers_count || 0
//           } followers, create content based on this request: ${prompt}`,
//         },
//       ],
//       temperature: 0.8,
//       max_tokens: 4000,
//     });

//     const generatedContent = {
//       id: Date.now().toString(),
//       ideas: parseContentIdeas(completion.choices[0].message.content),
//     };

//     res.json(generatedContent);
//   } catch (error) {
//     console.error("Custom content generation error:", error);
//     res.status(500).json({
//       message: "Failed to generate custom content",
//       error: error.message,
//     });
//   }
// };


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

// Helper function to analyze user writing style
const analyzeUserStyle = (recentPosts) => {
  if (!recentPosts || recentPosts.length === 0) {
    return "No style data available; use a professional yet engaging tone.";
  }

  const captions = recentPosts.map((post) => post.caption || "").filter(Boolean);
  if (captions.length === 0) {
    return "Style: Neutral, no captions to analyze; default to engaging tone.";
  }

  const wordCount = captions.join(" ").split(/\s+/).length;
  const avgLength = wordCount / captions.length;
  const emojiCount = (captions.join().match(/[\p{Emoji}]/gu) || []).length;
  const usesExclamation = captions.some((c) => c.includes("!"));
  const usesQuestions = captions.some((c) => c.includes("?"));
  const casualWords = ["lol", "haha", "yep", "nah", "bruh"].some((w) =>
    captions.join().toLowerCase().includes(w)
  );
  const sarcasticWords = ["sure", "right", "totally", "whatever"].some((w) =>
    captions.join().toLowerCase().includes(w)
  );
  const positiveWords = ["awesome", "great", "love", "epic"].some((w) =>
    captions.join().toLowerCase().includes(w)
  );

  let tone = "neutral";
  if (sarcasticWords) tone = "sarcastic";
  else if (casualWords) tone = "casual";
  else if (positiveWords && usesExclamation) tone = "excited";
  else if (usesQuestions) tone = "engaging";
  else if (emojiCount > captions.length) tone = "playful";

  const emojis = captions.join().match(/[\p{Emoji}]/gu) || [];
  const emojiFreq = emojis.reduce((acc, e) => {
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const topEmojis = Object.entries(emojiFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emoji]) => emoji)
    .join(", ");

  return `
  User's writing style:
  - Tone: ${tone}
  - Average caption length: ${Math.round(avgLength)} words
  - Emoji usage: ${
    emojiCount > 0 ? `Frequent (${emojiCount} total), top emojis: ${topEmojis}` : "Rare"
  }
  - Phrasing: ${casualWords ? "Casual and conversational" : sarcasticWords ? "Dry and witty" : "Standard"}
  - Examples: "${captions[0]?.slice(0, 50) || "N/A"}", "${captions[1]?.slice(0, 50) || "N/A"}"
  `;
};

// Helper function to create the prompt based on profile data
const createDetailedPrompt = async (contentType, user) => {
  const profileData = await getInstagramProfile(user);
  const recentPosts = await getRecentPosts(user);
  const reelDurations = [15, 30, 45, 60, 90];
  const reelTime = reelDurations[Math.floor(Math.random() * reelDurations.length)];

  // Analyze recent posts for engagement
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

  // Analyze user style
  const styleAnalysis = analyzeUserStyle(recentPosts);

  const accountContext = profileData
    ? `
    Creating content for Instagram account @${profileData.username}:
    - Followers: ${profileData.followers_count}
    - Account focus: ${profileData.biography}
    - Content style: Professional yet engaging
    ${postAnalysis}
    ${styleAnalysis}
  `
    : "";

  const prompts = {
    roast: `
    ${accountContext}
    Generate a savage, no-mercy roast for the user based on their profile and style.
    - Match their tone, phrasing, and emoji use: ${styleAnalysis}.
    - Expose their laziness, delusions, or lack of effort.
    - Use sarcasm, wit, and brutal honesty—no sugarcoating.
    - End with a **cold reality check** that leaves them with no excuses, written in their voice.

    Example Output (adjusted to user's style):
    "Oh, look who crawled outta bed—@${profileData.username}, huh? You’re ‘grinding’ so hard I can hear the snooze button crying. Those big dreams? Just captions you forgot to post. Reality check: **No one’s clapping for your naps, champ. Wake up or stay basic.**"`,
    carousel: `
    ${accountContext}
    1. Title: Write a catchy, attention-grabbing title with humor that matches the user's style: ${styleAnalysis}.
       Example: "5 Ways to Adult Without Crying (Spoiler: You'll Still Cry)."

    2. Caption: Write a 200-300 character caption that includes:
       - Humor that matches the user's tone and phrasing: ${styleAnalysis}.
       - Strategic line breaks for readability.
       - Relevant emojis from their top usage (${styleAnalysis}).
       - A strong call-to-action with a funny remark at the end in their voice.

    3. Content Breakdown:
       - Slide 1 - Introduction & Hook:
          - Visuals: A fun, colorful image of someone drowning in paperwork or a cup of coffee spilled over a laptop.
          - Text Overlay: "Welcome to the chaos—written in your style: ${styleAnalysis}."

       - Slide 2 - Step 1: Wake Up Like a Responsible Adult:
          - Visuals: Show a person trying to wake up early but hitting snooze on their alarm for the 8th time.
          - Text Overlay: "Step 1: Wake up... or not. Match user style: ${styleAnalysis}."

       - Slide 3 - Step 2: Pretend to Have Your Life Together:
          - Visuals: Show someone walking out of the house in a suit but with mismatched socks or spilling coffee on their shirt.
          - Text Overlay: "Step 2: Fake it till you make it, in your tone: ${styleAnalysis}."

       - Slide 4 - Step 3: Budgeting (But You're Just Here for the Memes):
          - Visuals: Show a person frantically looking at their bank statement while eating fast food.
          - Text Overlay: "Step 3: Budget? Nah, memes. Style: ${styleAnalysis}."

       - Slide 5 - Step 4: Finally Adulting (Kind Of):
          - Visuals: Show someone finally making it through their day, exhausted but somewhat successful, sitting down with a glass of wine.
          - Text Overlay: "Step 4: Survived... sorta. CTA in your voice: ${styleAnalysis}."
          - Call to Action: "Swipe right—or flop harder. Your call, styled like you."

    4. Hashtags: Include 10-15 relevant hashtags, grouped by:
       - Industry-specific: #business #entrepreneurship #productivityhacks #adulting101 #lifehacks
       - Trending in your niche: #adultingfails #memesdaily #workhumor #adulthoodstruggles #funnycontent
       - Branded hashtags: #FakeItTillYouMakeIt #AdultingFails #SurvivingAdulting
       - Engagement hashtags: #SwipeRight #TagYourFriends #AdultingSucks #RelatableContent #LifeInTheChaos
       - Tailor some to reflect user style based on ${styleAnalysis}.`,
    reel: `
    ${accountContext}
    1. Title: Write a catchy, attention-grabbing title with humor that matches the user's style: ${styleAnalysis}.
       Example: "When You Try to Be Productive but Netflix Says 'Not Today.'"

    2. Caption: Write a 200-300 character caption that includes:
       - Humor mixed with the user's tone and phrasing: ${styleAnalysis}.
       - Strategic line breaks for readability.
       - Relevant emojis from their top usage (${styleAnalysis}).
       - Strong call-to-action with humor at the end, written in their voice.

    3. Content Breakdown (Script with Timestamps):
       - 0:00-0:03 - Hook: Open with a funny or unexpected statement that grabs attention immediately, styled like the user: ${styleAnalysis}.
          - Visuals: Show a quick shot of you looking at your phone with a disgusted face as you scroll through an old "diet plan" app.
          - Text Overlay/Voiceover: Text: "POV: You’re still a mess, per your style."

       - 0:04-${Math.min(0.2 * reelTime, 15).toFixed(2)} - Introduce the main problem with humor: Build on the hook with a humorous elaboration in their tone: ${styleAnalysis}.
          - Visuals: Show your messy workspace with snacks everywhere, a laptop open with a YouTube video paused mid-play.
          - Text Overlay/Voiceover: Voiceover: "When you say ‘tomorrow’ but mean never, styled your way."
          - Transition: Quick fade-out of the workspace scene to you opening a fridge.

       - ${Math.min(0.2 * reelTime, 15).toFixed(2)}-${Math.min(0.5 * reelTime, 45).toFixed(2)} - Build the story: Present a humorous step-by-step on how you "start" being productive (but fail), in their style: ${styleAnalysis}.
          - Visuals: You opening your laptop and just staring at it, looking confused.
          - Text Overlay/Voiceover: Text: "Step 1: Stare. Step 2: Snack. Your vibe."
          - Voiceover: "Step 3: Why work when snacks exist? Per your tone."
          - Transition: Quick cut to a close-up of you with a slice of pizza.
          - Visual Cue: Zoom-in on the pizza slice with exaggerated slow-motion for comedic effect.

       - ${Math.min(0.5 * reelTime, 45).toFixed(2)}-${Math.min(0.85 * reelTime, 75).toFixed(2)} - Add the twist: Introduce a funny twist or punchline in their style: ${styleAnalysis}.
          - Visuals: Show you eating the pizza, feeling victorious.
          - Text Overlay/Voiceover: Voiceover: "Plot twist: Pizza’s the real MVP, your way."
          - Transition: Dramatic zoom-out with a slow-motion shot of you eating the pizza.
          - Visual Cue: Add a quick flash of 'Success!' text in bold, animated font.

       - ${Math.min(0.85 * reelTime, 75).toFixed(2)}-${reelTime} - End with a Call-to-Action: Finish strong with humor and a relatable comment in their voice: ${styleAnalysis}.
          - Visuals: Show a group of empty snack wrappers and you lying on the couch in an exaggerated relaxed position.
          - Text Overlay/Voiceover: Text: "Productivity? Nope, snackivity—your style."
          - Voiceover: "Drop your fave emoji if you’re team snacks, per your vibe."
          - Transition: Fade out with you laying down, snacking, and a text overlay saying "Call it a day."

    4. Hashtags: Include 10-15 relevant hashtags, grouped by:
       - Reel-specific: #reels #instareels #funnyreels #reelsdaily #humorreels
       - Niche-specific: #ProductivityFails #ProcrastinationGoals #LazyDays #DietWho #SnackLife #NapKing
       - Trending hashtags: #NetflixAndChill #ProcrastinationPro #SnackAttack
       - Engagement hashtags: #TagYourBuddy #YouToo #LazyVibes
       - Tailor some to reflect user style based on ${styleAnalysis}.`,
    story: `
    ${accountContext}
    Create a story sequence with the following details, matching the user's style: ${styleAnalysis}:
    1. Title: Write an attention-grabbing and humorous title in their tone and phrasing.
       Example: "When Life Gives You Lemons… You Probably Forgot to Pay the Bills."

    2. Caption: Write a 200-300 character caption that includes:
       - Concise and impactful wording in their style: ${styleAnalysis}.
       - Relevant emojis from their top usage (${styleAnalysis}).
       - A call to engage the audience, written in their voice.
       - A funny or playful remark/question at the end.

    3. Content Breakdown:
       - Opening Hook (Story 1):
          - Visual: Show a picture of a person staring at a phone or looking confused.
          - Text Overlay: "POV: You’re lost in life, styled your way: ${styleAnalysis}."
          - CTA: Add a little arrow pointing to the next slide: "Next, your vibe continues."

       - Story Frame Sequence:
          - Story 2 - Frame 1 (Poll):
             - Visual: A shot of someone dramatically facepalming or rolling their eyes.
             - Text Overlay: "Winning or faking it? Your tone: ${styleAnalysis}."
             - Poll Options: "Winning at Life" vs. "Faking It"
             - Engagement Prompt: "Vote now, show us your style!"

          - Story 3 - Frame 2 (Interactive Question):
             - Visual: A funny image of a stressed person with a mountain of coffee cups or a phone buzzing with endless notifications.
             - Text Overlay: "Your life hack? Spill it, per ${styleAnalysis}."
             - Question Sticker: "Drop your best hack below!"

          - Story 4 - Frame 3 (Would You Rather Poll):
             - Visual: A split screen image: one side shows a giant duck and the other shows a hundred tiny horses.
             - Text Overlay: "Big duck or tiny horses? Your call: ${styleAnalysis}."
             - Poll Options: "Horse-Sized Duck" vs. "100 Duck-Sized Horses"
             - Engagement Prompt: "Pick one, you weirdo—in your voice."

          - Story 5 - Final Frame (CTA):
             - Visual: A relaxing image of someone unwinding after a crazy day (like lying on the couch with snacks).
             - Text Overlay: "Share your fail, styled like you: ${styleAnalysis}."
             - CTA: "Tap to spill—what’s your worst flop?"

    4. Hashtags: Include 5-10 relevant hashtags, grouped by:
       - Trending humor-related: #AdultingStruggles #LifeFails #ProcrastinationProblems #FunnyMemes #RelatableContent
       - Interactive: #PollTime #VoteNow #InteractiveStories #QuestionOfTheDay
       - Engagement: #ShareYourStory #TellUsYourFail #SwipeUpToShare
       - Tailor some to reflect user style based on ${styleAnalysis}.`,
    single: `
    ${accountContext}
    Create a single post with the following details, matching the user's style: ${styleAnalysis}:
    1. Title: Write a clear, attention-grabbing title with a humorous twist in their tone and phrasing.
       Example: "Why Coffee is the Only Reason I Function Before Noon."

    2. Caption: Create an engaging caption (200-300 characters) that:
       - Matches the user's tone and phrasing: ${styleAnalysis}.
       - Uses relevant emojis from their top usage (${styleAnalysis}).
       - Includes strategic line breaks.
       - Ends with a strong call-to-action and a funny remark in their voice.

    3. Content Breakdown:
       - Visual Description: Suggest a funny or quirky visual that fits their niche.
          Example: "A mug that says 'But First, Coffee' with a face that says 'But Actually, Always Coffee.'"
       - Key Message: Include a light-hearted joke or pun in their style: ${styleAnalysis}.
          Example: "Coffee in hand, world domination in mind—or at least noon."
       - Engagement Triggers: Add a funny question or comment to spark engagement, in their voice: ${styleAnalysis}.
          Example: "What’s your coffee order? Mine’s ‘keep me alive.’"

    4. Hashtags: List 10-15 relevant hashtags grouped by category:
       - General Hashtags: #CoffeeLover #MorningRitual #CaffeineAddict #SurvivalMode #CoffeeObsessed #CoffeeFirst #AdultingStruggles
       - Engagement Hashtags: #TagYourCoffeeBuddy #CoffeeTime #CaffeineFix
       - Humor Hashtags: #CoffeeHumor #FunnyPosts #MorningStruggles #CoffeeIsLife
       - Tailor some to reflect user style based on ${styleAnalysis}.`
  };

  return `
  ${prompts[contentType] || prompts.all}

  Format each section clearly with "Title:", "Caption:", "Content:", and "Hashtags:".
  Ensure the content aligns with the account's professional image while maintaining engagement and mimicking the user's unique writing style from ${styleAnalysis}.
  `;
};

// Helper function to parse the generated content (unchanged)
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
          currentIdea = { title: "", content: "", caption: "", hashtags: [] };
        }
        currentIdea.title = section.replace(/^title:\s*/i, "").trim();
      } else if (lowerSection.startsWith("caption:")) {
        currentIdea.caption = section.replace(/^caption:\s*/i, "").trim();
      } else if (lowerSection.startsWith("hashtags:") || section.includes("#")) {
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

// Helper function to determine top engaging post type (unchanged)
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

// Main functions (unchanged except for export syntax consistency)
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