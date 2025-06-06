/**
 * @copyright 2024 Jeremie Mabiala
 * @license Apache-2.0
 * 
 */

/**
 * Node modules
 */

import {Router } from 'express';

const router = Router();

/**
 * Routes
 */

import authRoutes from '@/routes/v1/auth';

/**
 * Root root
 */

router.get('/', (req, res) => {
      res.status(200).json({
        message: 'API is live', 
        status: 'success',
        version: '1.0.0',
        docs: 'https://documenter.getpostman.com/view/45688618/2sB2x2LaT2',
        timestamp: new Date().toISOString(),
      });
});
router.use('/auth', authRoutes);

export default router;