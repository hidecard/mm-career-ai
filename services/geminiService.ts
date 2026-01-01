import { CareerGuide, Resume, Mentor } from "../types";
import { findMatchingMentorsFromDatabase } from "./mentorDatabase";

// Puter.js is loaded via script tag in index.html and provides free, unlimited Gemini API access
// No API key required - uses the "User-Pays" model

/**
 * Helper function to parse JSON from AI response
 * Putser.js returns text that may contain JSON within code blocks
 */
const parseAIResponse = (text: string): any => {
  // Try to parse as-is first
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Try to find any JSON object in the text
        const anyJsonMatch = text.match(/\{[\s\S]*\}/);
        if (anyJsonMatch) {
          try {
            return JSON.parse(anyJsonMatch[0]);
          } catch {
            // Last resort: try to fix common JSON issues
            const fixedText = text
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();
            try {
              return JSON.parse(fixedText);
            } catch {
              throw new Error("AI ၏ တုံ့ပြန်မှုကို ဖတ်၍မရပါ။ ခဏနေမှ ထပ်ကြိုးစားကြည့်ပေးပါ။");
            }
          }
        }
      }
    }
    throw new Error("AI ၏ တုံ့ပြန်မှုကို ဖတ်၍မရပါ။ ခဏနေမှ ထပ်ကြိုးစားကြည့်ပေးပါ။");
  }
};

/**
 * Helper function to stream AI response and collect text
 */
const streamAIResponse = async (chatPromise: Promise<any>): Promise<string> => {
  const response = await chatPromise;
  let fullText = "";
  
  if (response[Symbol.asyncIterator]) {
    for await (const part of response) {
      if (part?.text) {
        fullText += part.text;
      }
    }
  } else if (typeof response === 'string') {
    fullText = response;
  } else if (response.text) {
    fullText = response.text;
  } else {
    // Try to convert to string
    fullText = String(response);
  }
  
  return fullText;
};

export const generateCareerGuide = async (currentSkills: string, interests: string): Promise<CareerGuide> => {
  const prompt = `လက်ရှိ ကျွမ်းကျင်မှု: "${currentSkills}" နှင့် စိတ်ဝင်စားမှု: "${interests}" တို့အပေါ် အခြေခံ၍ အသေးစိတ် Career Roadmap တစ်ခုကို မြန်မာဘာသာဖြင့် ရေးသားပေးပါ။ ထို့အပြင် ဤအရည်အချင်းများနှင့် ကိုက်ညီနိုင်သော အခြားအလုပ်အကိုင် ၂ ခုမှ ၃ ခုကိုလည်း အကြံပြုပေးပါ။

သင်သည် မြန်မာနိုင်ငံရှိ ထိပ်တန်း အသက်မွေးဝမ်းကျောင်း လမ်းညွှန်သူ (Career Strategist) တစ်ဦး ဖြစ်သည်။ အသုံးပြုသူ၏ အချက်အလက်များအပေါ် မူတည်၍ အောင်မြင်မှုရရှိစေမည့် အဆင့်ဆင့် လမ်းပြမြေပုံကို ပေးပါ။ ရလာဒ်အားလုံးကို မြန်မာဘာသာဖြင့်သာ ပေးရမည်။ JSON format ဖြင့်သာ ပြန်ပေးပါ။

Respond ONLY with valid JSON in the following format:
{
  "jobTitle": "အလုပ်ခေါင်းစဉ်",
  "matchScore": 85,
  "summary": "အလုပ်အကြောင်း အနှစ်ချုပ်",
  "requiredSkills": ["ကျွမ်းကျင်မှု ၁", "ကျွမ်းကျင်မှု ၂"],
  "salaryRange": "၃၀၀၀၀၀ - ၅၀၀၀၀၀ ကျပ်/လ",
  "marketDemand": "ဈေးကွက်လိုအပ်ချက်",
  "requiredExperience": "လိုအပ်သော အတွေ့အကြုံ",
  "softSkills": ["အပြောအဆို စသည့် � мяဆိုင်ရာ ကျွမ်းကျင်မှုများ"],
  "interviewTips": ["အင်တာဗျူး အကြံပြုချက်များ"],
  "potentialCompanies": ["လုပ်ငန်းများ စာရင်း"],
  "recommendedCertifications": ["လက်မှတ်များ စာရင်း"],
  "mentorshipAdvice": "သင်ကောင်းပေးသော အကြံပြုချက်",
  "longTermGoal": "ရေရှည် ပန်းတိုင်",
  "roadmap": [
    {
      "title": "အဆင့် ၁ - အခြေခံ မြေပြင်ပြင်",
      "description": "အဆင့်အသေးစိတ် ဖော်ပြချက်",
      "skillsToAcquire": ["ကျွမ်းကျင်မှုများ"],
      "toolsToMaster": ["ကိရိယာများ"],
      "estimatedTime": "၃ လ",
      "difficulty": "လွယ်ကူသော",
      "prerequisites": ["လိုအပ်ချက်များ"],
      "projectIdea": "ပရောဂျက် အကြံပြုချက်",
      "successMetrics": "အောင်မြင်မှု အတိုင်းအတာ",
      "resources": [{"title": "အရင်းအမြစ် ၁", "url": "https://example.com"}]
    }
  ],
  "relatedJobs": [
    {
      "title": "ဆက်စပ် အလုပ်ခေါင်းစဉ် ၁",
      "summary": "အလုပ်အကြောင်း အနှစ်ချုပ်"
    }
  ]
}`;

  // Use Puter.js for free, unlimited Gemini API access
  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);
  
  if (!text) {
    throw new Error("AI ဆီမှ အချက်အလက်များ မရရှိနိုင်ပါ။");
  }

  try {
    const data = parseAIResponse(text);
    return {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      generatedAt: new Date().toISOString()
    } as CareerGuide;
  } catch (error) {
    throw new Error("AI ၏ တုံ့ပြန်မှုကို ဖတ်၍မရပါ။ ခဏနေမှ ထပ်ကြိုးစားကြည့်ပေးပါ။");
  }
};

export const chatWithMentor = async (history: {role: 'user' | 'model', parts: {text: string}[]}[], message: string) => {
  const systemPrompt = `သင်သည် မြန်မာနိုင်ငံမှ နွေးထွေးဖော်ရွေသော Career Mentor တစ်ဦးဖြစ်သည်။ အသုံးပြုသူ၏ မေးခွန်းများကို မြန်မာဘာသာဖြင့် တိုတိုနှင့် လိုရင်းရောက်အောင် ဖြေကြားပေးပါ။`;

  // Build conversation history for Puter.js
  let conversationHistory = "";
  for (const msg of history) {
    const role = msg.role === 'user' ? "အသုံးပြုသူ" : "မိုတာ";
    conversationHistory += `${role}: ${msg.parts[0].text}\n`;
  }
  
  const fullPrompt = `${systemPrompt}\n\nယခင် စကားပြောဆိုမှု:\n${conversationHistory}\n\nအသုံးပြုသူ: ${message}`;

  // Use Puter.js for free, unlimited Gemini API access with streaming
  const responsePromise = puter.ai.chat(fullPrompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const response = await responsePromise;
  let fullText = "";
  
  for await (const part of response) {
    if (part?.text) {
      fullText += part.text;
    }
  }
  
  return fullText;
};

export const searchJobsInMyanmar = async (jobTitle: string) => {
  const prompt = `မြန်မာနိုင်ငံတွင် "${jobTitle}" နှင့် ပတ်သက်သော အလုပ်အကိုင် အခွင့်အလမ်း ၃ ခုမှ ၅ ခုအထိ ရှာဖွေပေးပါ။ အရင်းအမြစ် (Source) များကိုလည်း ဖော်ပြပေးပါ။ မြန်မာဘာသာဖြင့်သာ ရေးသားပါ။

Respond with JSON in the following format:
{
  "jobs": [
    {
      "title": "အလုပ်ခေါင်းစဉ်",
      "company": "ကုမ္ပဏီအမည်",
      "location": "တည်နေရာ",
      "salary": "လစာအပြင်",
      "description": "အလုပ်အကြောင်း အသေးစိတ်",
      "source": "အရင်းအမြစ်"
    }
  ]
}`;

  // Use Puter.js for free, unlimited Gemini API access
  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);
  
  try {
    const data = parseAIResponse(text);
    return {
      text: text,
      jobs: data.jobs || []
    };
  } catch {
    return {
      text: text,
      jobs: []
    };
  }
};

export const generateResumeSuggestions = async (careerGuide: CareerGuide, resumeData: Partial<Resume>): Promise<{
  summary: string;
  skills: string[];
  experience: string[];
  keywords: string[];
}> => {
  const prompt = `အောက်ပါ Career Guide နှင့် Resume data အပေါ် အခြေခံ၍ မြန်မာနိုင်ငံရှိ အလုပ်ရှာဖွေသူများအတွက် အသုံးဝင်သော Resume suggestions များကို ပေးပါ။

Career Guide:
- Job Title: ${careerGuide.jobTitle}
- Required Skills: ${careerGuide.requiredSkills.join(', ')}
- Soft Skills: ${careerGuide.softSkills.join(', ')}
- Recommended Certifications: ${careerGuide.recommendedCertifications.join(', ')}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

မြန်မာဘာသာဖြင့် JSON format ဖြင့်သာ ပြန်ပေးပါ။

Respond with JSON in the following format:
{
  "summary": "အသုံးပြုသူ၏ ကျွမ်းကျင်မှုများနှင့် အတွေ့အကြုံများကို အကျဉ်းချုပ် ရေးသားထားသော စာသား",
  "skills": ["အကြံပြုသော ကျွမ်းကျင်မှု ၁", "အကြံပြုသော ကျွမ်းကျင်မှု ၂"],
  "experience": ["အတွေ့အကြုံ အကြံပြုချက် ၁", "အတွေ့အကြုံ အကြံပြုချက် ၂"],
  "keywords": ["အလုပ်ရှာဖွေရာတွင် အသုံးဝင်သော keyword ၁", "keyword ၂"]
}`;

  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);

  try {
    const data = parseAIResponse(text);
    return data;
  } catch (error) {
    throw new Error("Resume suggestions များ ဖန်တီးရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။");
  }
};

export const findMatchingMentors = async (careerGuide: CareerGuide, userInterests: string): Promise<Mentor[]> => {
  const prompt = `အောက်ပါ Career Guide နှင့် အသုံးပြုသူ၏ စိတ်ဝင်စားမှုများအပေါ် အခြေခံ၍ ကိုက်ညီသော Mentors များကို ရှာဖွေပေးပါ။ မြန်မာနိုင်ငံရှိ အလုပ်အကိုင် လောကမှ အတွေ့အကြုံရှိသူများကို ဦးစားပေးပါ။

Career Guide:
- Job Title: ${careerGuide.jobTitle}
- Required Skills: ${careerGuide.requiredSkills.join(', ')}
- Soft Skills: ${careerGuide.softSkills.join(', ')}
- Long Term Goal: ${careerGuide.longTermGoal}

User Interests: ${userInterests}

မြန်မာဘာသာဖြင့် JSON format ဖြင့်သာ ပြန်ပေးပါ။ ၃ ဦးမှ ၅ ဦးအထိ ကိုက်ညီသော Mentors ကို ပေးပါ။

Respond with JSON in the following format:
{
  "mentors": [
    {
      "name": "မိုတာ အမည်",
      "jobTitle": "လက်ရှိ အလုပ်ခေါင်းစဉ်",
      "company": "လုပ်ငန်းအမည်",
      "industry": "လုပ်ငန်းကဏ္ဍ",
      "experience": "အတွေ့အကြုံ နှစ်အရေအတွက်",
      "location": "တည်နေရာ",
      "expertise": ["ကျွမ်းကျင်မှု ၁", "ကျွမ်းကျင်မှု ၂"],
      "availability": "Available",
      "bio": "မိုတာ၏ အကျဉ်းချုပ် ကိုယ်ရေးအကျဉ်း",
      "email": "mentor@example.com",
      "matchScore": 85,
      "matchedInterests": ["ကိုက်ညီသော စိတ်ဝင်စားမှု ၁", "ကိုက်ညီသော စိတ်ဝင်စားမှု ၂"]
    }
  ]
}`;

  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);

  try {
    const data = parseAIResponse(text);
    return data.mentors.map((mentor: any) => ({
      ...mentor,
      id: Math.random().toString(36).substring(2, 11),
      linkedin: mentor.linkedin || undefined
    })) as Mentor[];
  } catch (error) {
    throw new Error("Mentors ရှာဖွေရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။");
  }
};

export const searchJobOpportunities = async (careerGuide: CareerGuide, location: string = 'ရန်ကင်း'): Promise<Job[]> => {
  const prompt = `မြန်မာနိုင်ငံတွင် "${careerGuide.jobTitle}" နှင့် ပတ်သက်သော အလုပ်အကိုင် အခွင့်အလမ်း ၅ ခုမှ ၈ ခုအထိ ရှာဖွေပေးပါ။ အထူးသဖြင့် ${location} ဒေသတွင် ရှိသော အလုပ်အကိုင်များကို ဦးစားပေးပါ။

Career Guide:
- Job Title: ${careerGuide.jobTitle}
- Required Skills: ${careerGuide.requiredSkills.join(', ')}
- Salary Range: ${careerGuide.salaryRange}

မြန်မာဘာသာဖြင့် JSON format ဖြင့်သာ ပြန်ပေးပါ။ အလုပ်အကိုင် အခွင့်အလမ်းများကို အောက်ပါ format ဖြင့် ပေးပါ။

Respond with JSON in the following format:
{
  "jobs": [
    {
      "title": "အလုပ်ခေါင်းစဉ်",
      "company": "ကုမ္ပဏီအမည်",
      "location": "တည်နေရာ",
      "salary": "လစာအပြင်",
      "type": "Full-time",
      "description": "အလုပ်အကြောင်း အသေးစိတ်",
      "requirements": ["လိုအပ်သော ကျွမ်းကျင်မှု ၁", "လိုအပ်သော ကျွမ်းကျင်မှု ၂"],
      "benefits": ["အကျိုးခံစားခွင့် ၁", "အကျိုးခံစားခွင့် ၂"],
      "postedDate": "2024-01-15",
      "source": "အရင်းအမြစ် (ဥပမာ: JobStreet, Indeed, Company Website)",
      "url": "https://example.com/job-link"
    }
  ]
}`;

  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);

  try {
    const data = parseAIResponse(text);
    return data.jobs.map((job: any, index: number) => ({
      ...job,
      id: Math.random().toString(36).substring(2, 11),
      matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      applicationDeadline: job.applicationDeadline || undefined
    })) as Job[];
  } catch (error) {
    throw new Error("အလုပ်အကိုင် အခွင့်အလမ်းများ ရှာဖွေရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။");
  }
};

export const findLearningResources = async (careerGuide: CareerGuide, userSkills: string[]): Promise<LearningResource[]> => {
  const prompt = `မြန်မာနိုင်ငံရှိ လူငယ်များအတွက် "${careerGuide.jobTitle}" နှင့် ပတ်သက်သော သင်ယူရန် အရင်းအမြစ်များ ၆ ခုမှ ၈ ခုအထိ အကြံပြုပေးပါ။ အထူးသဖြင့် အွန်လိုင်းသင်ယူရန် အရင်းအမြစ်များကို ဦးစားပေးပါ။

Career Guide:
- Job Title: ${careerGuide.jobTitle}
- Required Skills: ${careerGuide.requiredSkills.join(', ')}
- Current User Skills: ${userSkills.join(', ')}

မြန်မာဘာသာဖြင့် JSON format ဖြင့်သာ ပြန်ပေးပါ။ သင်ယူရန် အရင်းအမြစ်များကို အောက်ပါ format ဖြင့် ပေးပါ။

Respond with JSON in the following format:
{
  "resources": [
    {
      "title": "သင်ယူရန် အရင်းအမြစ် အမည်",
      "type": "Course",
      "platform": "Udemy / Coursera / YouTube / အခြား",
      "description": "အရင်းအမြစ် အကြောင်း အသေးစိတ်",
      "duration": "၃ လ / ၂၀ နာရီ / အခြား",
      "level": "Beginner",
      "price": "အခမဲ့ / ၅၀၀၀၀ ကျပ် / အခြား",
      "url": "https://example.com/resource-link",
      "skills": ["ကျွမ်းကျင်မှု ၁", "ကျွမ်းကျင်မှု ၂"],
      "rating": 4.5
    }
  ]
}`;

  const responsePromise = puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview',
    stream: true
  });

  const text = await streamAIResponse(responsePromise);

  try {
    const data = parseAIResponse(text);
    return data.resources.map((resource: any, index: number) => ({
      ...resource,
      id: Math.random().toString(36).substring(2, 11),
      matchScore: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
    })) as LearningResource[];
  } catch (error) {
    throw new Error("သင်ယူရန် အရင်းအမြစ်များ ရှာဖွေရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။");
  }
};

