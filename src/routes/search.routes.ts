import { Router } from 'express';
import { searchAyahs } from '../controllers/search.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const searchRouter = Router();

searchRouter.get('/', asyncHandler(searchAyahs));
