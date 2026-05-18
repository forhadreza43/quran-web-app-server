import { Router } from 'express';
import { getAllSurahs, getSurahById } from '../controllers/surah.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const surahRouter = Router();

surahRouter.get('/', asyncHandler(getAllSurahs));
surahRouter.get('/:id', asyncHandler(getSurahById));
