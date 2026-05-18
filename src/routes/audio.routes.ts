import { Router } from 'express';
import {
   getAudioUrl,
   getSurahAudioUrls,
} from '../controllers/audio.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const audioRouter = Router();

audioRouter.get('/:surah', asyncHandler(getSurahAudioUrls));
audioRouter.get('/:surah/:ayah', asyncHandler(getAudioUrl));
