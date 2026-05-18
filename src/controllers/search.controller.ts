import { z } from 'zod';
import type { Request, Response } from 'express';
import { searchService } from '../services/search.service.js';
import { createResponse } from '../utils/apiResponse.js';

const searchQuerySchema = z.object({
   q: z.string().trim().min(1, 'Search query is required').max(150),
   limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const searchAyahs = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { q, limit } = searchQuerySchema.parse(req.query);
   const results = searchService.search(q, limit);

   res.json(
      createResponse('Search completed successfully', {
         query: q,
         count: results.length,
         results,
      })
   );
};
