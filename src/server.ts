import { app } from './app.js';
import { env } from './config/env.js';

if (process.env.VERCEL !== '1') {
   app.listen(env.PORT, () => {
      console.log(`Quran API running`);
   });
}

// const server = app.listen(env.PORT, () => {
//    console.log(
//       `Quran API listening on port ${env.PORT} in ${env.NODE_ENV} mode`
//    );
// });



