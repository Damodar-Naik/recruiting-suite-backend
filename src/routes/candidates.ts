import express from 'express';
import { getAllCandidates, updateCandidateStage, hrLogin } from '../controllers/candidateController';
import { verifyHRToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', hrLogin);
router.get('/candidates', verifyHRToken, getAllCandidates);
router.patch('/:id', verifyHRToken, updateCandidateStage);

export default router;