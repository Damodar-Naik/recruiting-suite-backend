import { GoogleGenAI } from "@google/genai";
import { CleanResumeData, CandidateEvaluation } from '../types/resume.js';

export async function evaluateCandidateWithLLM(
    candidateData: CleanResumeData,
    jobDescription?: string
): Promise<CandidateEvaluation> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!jobDescription) {
        throw new Error("Job Description is required for evaluation");
    }
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = createEvaluationPrompt(candidateData, jobDescription);

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.1,
            }
        });

        if (!response.text) {
            throw new Error("Empty response from Gemini API");
        }

        return JSON.parse(response.text) as CandidateEvaluation;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to evaluate candidate with Gemini");
    }
}

function createEvaluationPrompt(candidateData: CleanResumeData, jobDescription?: string): string {
    return `
You are an expert HR recruiter with 20 years of experience. Analyze the candidate's resume and provide a comprehensive evaluation.

CANDIDATE DATA:
${JSON.stringify(candidateData, null, 2)}

${jobDescription ? `
JOB DESCRIPTION:
${jobDescription}

Please evaluate the candidate specifically for this role.` : 'Please evaluate the candidate for general technical roles.'}

EVALUATION CRITERIA:
- Skills match and relevance
- Years of experience
- Education background
- Project complexity and scope
- Career progression

RESPONSE FORMAT:
You MUST return a valid JSON object with this exact structure:
{
    "overallScore": 85,
    "roleSuitability": [
        {
            "role": "Software Engineer",
            "score": 85,
            "reasoning": "Strong programming background but limited cloud experience"
        }
    ],
    "strengths": ["JavaScript", "React", "5 years experience"],
    "weaknesses": ["No cloud experience", "Limited leadership"],
    "skillGaps": ["AWS", "Docker"],
    "recommendation": "strong",
    "evaluationSummary": "Overall strong candidate with solid technical foundation..."
}

SCORING GUIDELINES:
- Overall Score: 0-100 based on experience, skills, education, and relevance
- Recommendation: "strong" (75-100), "moderate" (50-74), "weak" (0-49)
- Be objective and fair in your assessment
`;
}