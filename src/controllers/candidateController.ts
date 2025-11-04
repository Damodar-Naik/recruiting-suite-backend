import { Request, Response } from 'express';
import { Candidate } from '../models/Candidate';
const jwt = require('jsonwebtoken');

export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;

        let candidates;
        if (role && role !== 'all') {
            candidates = await Candidate.findAll({
                where: { appliedRole: role as string },
                order: [['createdAt', 'DESC']]
            });
        } else {
            candidates = await Candidate.findAll({
                order: [['createdAt', 'DESC']]
            });
        }

        res.json({ candidates });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
};

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { onboardingStage } = req.body;

        if (!onboardingStage) {
            return res.status(400).json({ error: "Missing onboardingStage" });
        }

        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        candidate.onboardingStage = onboardingStage;
        await candidate.save();

        res.json({
            success: true,
            message: "Candidate onboarding stage updated"
        });
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({ error: "Failed to update candidate" });
    }
};

export const hrLogin = async (req: Request, res: Response) => {
    const { password } = req.body;
    if (password?.toString().trim() === process.env.HR_PASSWORD?.toString().trim()) {
        // Generate JWT token
        const token = await jwt.sign(
            { role: 'hr', timestamp: Date.now() },
            process.env.JWT_SECRET, // Store this in your .env
            { expiresIn: '24h' } // Token expires in 24 
        );

        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
};