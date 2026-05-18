import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
   NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
   PORT: z.coerce.number().int().positive().default(5000),
   CORS_ORIGIN: z.string().default('http://localhost:3000'),
   API_PREFIX: z.string().default('/api/v1'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
   console.error(
      'Invalid environment configuration',
      parsedEnv.error.flatten()
   );
   process.exit(1);
}

export const env = parsedEnv.data;
