import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

export const verifyHRToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers?.authorization) {
        return res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_USER' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Error while validating user', code: 'INVALID_USER' });
    }
};