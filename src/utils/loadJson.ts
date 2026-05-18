import fs from 'node:fs';
import path from 'node:path';

export const loadJsonFromDataDir = <T>(fileName: string): T => {
   const candidates = [
      path.resolve(process.cwd(), 'src', 'data', fileName),
      path.resolve(process.cwd(), 'dist', 'data', fileName),
   ];

   const filePath = candidates.find((candidate) => fs.existsSync(candidate));

   if (!filePath) {
      throw new Error(
         `Missing normalized data file "${fileName}". Run "npm run normalize" before starting the API.`
      );
   }

   const raw = fs.readFileSync(filePath, 'utf8');

   if (!raw.trim()) {
      throw new Error(
         `Normalized data file "${fileName}" is empty. Run "npm run normalize" before starting the API.`
      );
   }

   return JSON.parse(raw) as T;
};
