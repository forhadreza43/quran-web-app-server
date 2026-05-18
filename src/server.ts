import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
   console.log(
      `Quran API listening on port ${env.PORT} in ${env.NODE_ENV} mode`
   );
});

const shutdown = (signal: NodeJS.Signals): void => {
   console.log(`${signal} received. Closing HTTP server...`);

   server.close((error) => {
      if (error) {
         console.error('HTTP server shutdown failed', error);
         process.exit(1);
      }

      console.log('HTTP server closed');
      process.exit(0);
   });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
