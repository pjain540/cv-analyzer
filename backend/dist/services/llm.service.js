import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export const extractResumeData = async (text) => {
    const prompt = `Extract the following information from the resume text and return it as a JSON object with the following fields:
    name: string
    email: string
    phone: string
    skills: array of strings
    experience: string
    education: string
    linkedInUrl: string
    gitHubUrl: string
    portfolioUrl: string
    aiSummary: string
    role: string

    experience should contain total years of experience example : 0-3 months, 3-6 months, 1 year, 1-2 years, 5+ years, if it contains like 1.2+ then keep it same please
    role is the role candidate is expirenced in like software engineer, data scientist, etc
    aiSummary should be bried 2 sentences professional summary
    also if a field is not found, use an empty string or empty array as per the requirement
    Resume Text: ${text}`;
    const chatCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });
    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
};
export const analyzeResume = async (resumeData, jobDescription) => {
    const prompt = `Analyze the following resume against the job description and provide a match score, match percentage, and a brief AI remark.
    
    Job Description: ${jobDescription}
    Resume Data: ${resumeData}
    
    Return the result as a JSON object with the following fields:
    score: number (0-100)
    matchPercentage: number (0-100)
    aiRemark: string (brief professional feedback)
    `;
    const chatCompletion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1 //this is for deterministic output means it will give same output for same input and less creative
    });
    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
};
//# sourceMappingURL=llm.service.js.map