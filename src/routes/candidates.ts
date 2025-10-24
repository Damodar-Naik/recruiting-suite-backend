import express from 'express';
import { getAllCandidates, updateCandidateStage } from '../controllers/candidateController';

const router = express.Router();

router.get('/', getAllCandidates);
router.patch('/:id', updateCandidateStage);

export default router;