import { z } from 'zod';
import type { Request, Response } from 'express';
import { quranService } from '../services/quran.service.js';
import { createResponse } from '../utils/apiResponse.js';

const ayahParamsSchema = z.object({
   surah: z.coerce.number().int().min(1).max(114),
   ayah: z.coerce.number().int().min(1).max(286),
});

export const getAyah = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { surah, ayah } = ayahParamsSchema.parse(req.params);
   const foundAyah = quranService.getAyah(surah, ayah);

   res.json(createResponse('Ayah fetched successfully', foundAyah));
};
