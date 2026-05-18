import { z } from 'zod';
import type { Request, Response } from 'express';
import { quranService } from '../services/quran.service.js';
import { createResponse } from '../utils/apiResponse.js';

const surahParamsSchema = z.object({
   id: z.coerce.number().int().min(1).max(114),
});

export const getAllSurahs = async (
   _req: Request,
   res: Response
): Promise<void> => {
   const surahs = quranService.getAllSurahs();

   res.json(createResponse('Surahs fetched successfully', surahs));
};

export const getSurahById = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { id } = surahParamsSchema.parse(req.params);
   const surah = quranService.getSurahById(id);

   res.json(createResponse('Surah fetched successfully', surah));
};
