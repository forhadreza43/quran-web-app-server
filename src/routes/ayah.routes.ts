import { Router } from 'express';
import { getAyah } from '../controllers/ayah.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const ayahRouter = Router();

ayahRouter.get('/:surah/:ayah', asyncHandler(getAyah));
