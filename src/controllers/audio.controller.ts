import { z } from 'zod';
import type { Request, Response } from 'express';
import { audioService } from '../services/audio.service.js';
import { createResponse } from '../utils/apiResponse.js';

const audioParamsSchema = z.object({
   surah: z.coerce.number().int().min(1).max(114),
   ayah: z.coerce.number().int().min(1).max(286),
});

const surahAudioParamsSchema = z.object({
   surah: z.coerce.number().int().min(1).max(114),
});

export const getAudioUrl = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { surah, ayah } = audioParamsSchema.parse(req.params);
   const audio = audioService.getAudioUrl(surah, ayah);

   res.json(createResponse('Audio URL generated successfully', audio));
};

export const getSurahAudioUrls = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { surah } = surahAudioParamsSchema.parse(req.params);
   const audio = audioService.getSurahAudioUrls(surah);

   res.json(createResponse('Surah audio URLs generated successfully', audio));
};
