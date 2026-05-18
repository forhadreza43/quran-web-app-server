import type { APIResponse } from '../types/quran.types.js';

export const createResponse = <T>(
   message: string,
   data: T
): APIResponse<T> => {
   return {
      success: true,
      message,
      data,
   };
};
