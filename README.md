# Quran App Backend

Production-grade Express.js REST API for a Quran web application. The API uses TypeScript, Zod validation, Fuse.js search, and optimized JSON files generated from the `risan/quran-json` dataset.

## Stack

- Node.js + Express.js
- TypeScript with ES modules
- Zod for request validation
- Fuse.js for Arabic and English search
- dotenv, cors, helmet, morgan
- JSON data source, loaded once into memory at startup

## Setup

```bash
npm install
npm run normalize
npm run dev
```

The server defaults to `http://localhost:5000`.

## Environment

Create or update `.env`:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
API_PREFIX=/api/v1
```

## Scripts

```bash
npm run normalize  # generate optimized src/data JSON files
npm run dev        # run with tsx watch
npm run build      # compile TypeScript
npm start          # run dist/server.js
```

## Data Flow

Raw files live in `src/raw_data` and are expected to follow the `quran-json` structure:

- `quran.json`
- `quran_en.json`
- `chapters/en/index.json`

The normalization script generates:

- `src/data/surahs.json`
- `src/data/ayahs.json`
- `src/data/search-index.json`

The API never reads raw files during requests. Normalized JSON is loaded once when the service layer starts.

## Endpoints

Base URL: `/api/v1`

```http
GET /surahs
GET /surahs/:id
GET /ayah/:surah/:ayah
GET /search?q=mercy&limit=10
GET /audio/:surah/:ayah
```

Health check:

```http
GET /health
```

## Example Response

```json
{
  "success": true,
  "message": "Ayah fetched successfully",
  "data": {
    "id": 1,
    "surahNumber": 1,
    "ayahNumber": 1,
    "arabic": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
    "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful",
    "transliteration": "Bismi Allahi alrrahmani alrraheemi",
    "surahNameArabic": "الفاتحة",
    "surahNameEnglish": "Al-Fatihah",
    "surahTranslatedName": "The Opener",
    "revelationType": "meccan",
    "audioUrl": "https://everyayah.com/data/Alafasy_128kbps/001001.mp3"
  }
}
```

## Search

Search uses Fuse.js over precomputed fields:

- Arabic Quran text
- Normalized Arabic text with tashkeel removed
- English translation
- Surah English and translated names

Arabic normalization removes diacritics and normalizes common alif, hamza, ya, and ta marbuta variants.

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
  controllers/
  data/
  middleware/
  raw_data/
  routes/
  scripts/
  services/
  types/
  utils/
```
