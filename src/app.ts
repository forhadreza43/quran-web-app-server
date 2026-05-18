import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { createResponse } from './utils/apiResponse.js';
import { surahRouter } from './routes/surah.routes.js';
import { ayahRouter } from './routes/ayah.routes.js';
import { audioRouter } from './routes/audio.routes.js';
import { searchRouter } from './routes/search.routes.js';

export const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(
   cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
   })
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
   res.json(
      createResponse('API is healthy', {
         status: 'ok',
         uptime: process.uptime(),
         timestamp: new Date().toISOString(),
      })
   );
});

app.get('/', (_req, res) => {
   res.json(
      createResponse('Quran API is running', {
         health: '/health',
         version: 'v1',
         docs: '/api/v1',
      })
   );
});

app.use(`${env.API_PREFIX}/surahs`, surahRouter);
app.use(`${env.API_PREFIX}/ayah`, ayahRouter);
app.use(`${env.API_PREFIX}/audio`, audioRouter);
app.use(`${env.API_PREFIX}/search`, searchRouter);

app.use(notFound);
app.use(errorHandler);
