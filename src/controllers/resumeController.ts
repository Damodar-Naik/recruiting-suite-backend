import { Request, Response } from 'express';
import { AffindaAPI, AffindaCredential } from "@affinda/affinda";
import { Candidate } from '../models/Candidate';
import { extractCleanData } from '../services/affindaService';
import { evaluateCandidateWithLLM } from '../services/llmScoringService';
import { getJobDescriptionText } from '../services/jobDescriptionService';

export const parseResume = async (req: Request, res: Response) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const jobRole = req.body.jobRole as string;

        const credential = new AffindaCredential(process.env.AFFINDA_API_KEY!);
        const client = new AffindaAPI(credential);

        const doc = await client.createDocument({
            file: req.file.buffer,
            workspace: process.env.AFFINDA_WORKSPACE_ID!,
            fileName: req.file.originalname,
        });

        const cleanData = extractCleanData(doc);

        // Get job description for scoring
        const jobDescription = jobRole ? getJobDescriptionText(jobRole) : undefined;

        // Get LLM evaluation with specific job role
        const evaluation = await evaluateCandidateWithLLM(cleanData, jobDescription);

        debugger
        // Save to database
        const candidate = await Candidate.create({
            firstName: cleanData.candidateName.firstName,
            familyName: cleanData.candidateName.familyName,
            email: cleanData.email[0] || '',
            phone: cleanData.phoneNumber[0] || '',
            summary: cleanData.summary,
            totalYearsExperience: cleanData.totalYearsExperience,
            appliedRole: jobRole || '',
            overallScore: evaluation.overallScore,
            recommendation: evaluation.recommendation,
            onboardingStage: 'new',
            rawData: cleanData,
            evaluation: evaluation,
        });

        res.json({
            data: cleanData,
            evaluation,
            candidateId: candidate.id,
            evaluatedFor: jobRole,
            message: "Resume parsed, evaluated, and saved successfully"
        });
    } catch (error) {
        console.error("Error parsing resume:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
};