import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Ayah, SearchIndexRecord, Surah } from '../types/quran.types.js';
import { generateAudioUrl } from '../utils/generateAudioUrl.js';
import { normalizeSearchText } from '../utils/normalizeArabic.js';

type RawVerse = {
   id: number;
   text: string;
   translation?: string;
   transliteration?: string;
};

type RawChapter = {
   id: number;
   name: string;
   transliteration: string;
   translation?: string;
   type: string;
   total_verses: number;
   verses: RawVerse[];
};

type ChapterMetadata = {
   id: number;
   name: string;
   transliteration: string;
   translation: string;
   type: string;
   total_verses: number;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '..');
const RAW_DATA_DIRS = [
   path.resolve(SRC_DIR, 'raw_data'),
   path.resolve(SRC_DIR, 'raw-data'),
];
const OUTPUT_DATA_DIR = path.resolve(SRC_DIR, 'data');

const readJson = async <T>(filePath: string): Promise<T> => {
   const raw = await fs.readFile(filePath, 'utf8');
   return JSON.parse(raw) as T;
};

const pathExists = async (filePath: string): Promise<boolean> => {
   try {
      await fs.access(filePath);
      return true;
   } catch {
      return false;
   }
};

const resolveRawDataDir = async (): Promise<string> => {
   for (const candidate of RAW_DATA_DIRS) {
      if (await pathExists(candidate)) {
         return candidate;
      }
   }

   throw new Error(
      `Raw Quran dataset not found. Expected one of: ${RAW_DATA_DIRS.join(', ')}`
   );
};

const createChapterMap = (chapters: RawChapter[]): Map<number, RawChapter> => {
   return new Map(chapters.map((chapter) => [chapter.id, chapter]));
};

const normalizeQuran = async (): Promise<void> => {
   const rawDataDir = await resolveRawDataDir();

   console.log(`Using raw dataset: ${rawDataDir}`);
   console.log('Starting Quran normalization...');

   await fs.mkdir(OUTPUT_DATA_DIR, { recursive: true });

   const [arabicChapters, englishChapters, metadata] = await Promise.all([
      readJson<RawChapter[]>(path.join(rawDataDir, 'quran.json')),
      readJson<RawChapter[]>(path.join(rawDataDir, 'quran_en.json')),
      readJson<ChapterMetadata[]>(
         path.join(rawDataDir, 'chapters', 'en', 'index.json')
      ),
   ]);

   const arabicChapterMap = createChapterMap(arabicChapters);
   const englishChapterMap = createChapterMap(englishChapters);

   const surahs: Surah[] = metadata.map((chapter) => ({
      number: chapter.id,
      arabicName: chapter.name,
      englishName: chapter.transliteration,
      translatedName: chapter.translation,
      revelationType: chapter.type,
      totalAyahs: chapter.total_verses,
   }));

   const ayahs: Ayah[] = [];
   let globalAyahId = 1;

   for (const surah of surahs) {
      const arabicChapter = arabicChapterMap.get(surah.number);
      const englishChapter = englishChapterMap.get(surah.number);

      if (!arabicChapter || !englishChapter) {
         throw new Error(`Missing chapter data for surah ${surah.number}`);
      }

      if (arabicChapter.verses.length !== surah.totalAyahs) {
         throw new Error(
            `Surah ${surah.number} expected ${surah.totalAyahs} ayahs, found ${arabicChapter.verses.length}`
         );
      }

      for (const arabicVerse of arabicChapter.verses) {
         const englishVerse = englishChapter.verses.find(
            (verse) => verse.id === arabicVerse.id
         );

         if (!englishVerse?.translation) {
            throw new Error(
               `Missing English translation for ${surah.number}:${arabicVerse.id}`
            );
         }

         ayahs.push({
            id: globalAyahId,
            surahNumber: surah.number,
            ayahNumber: arabicVerse.id,
            arabic: arabicVerse.text,
            translation: englishVerse.translation,
            transliteration: arabicVerse.transliteration,
            surahNameArabic: surah.arabicName,
            surahNameEnglish: surah.englishName,
            surahTranslatedName: surah.translatedName,
            revelationType: surah.revelationType,
            audioUrl: generateAudioUrl(surah.number, arabicVerse.id),
         });

         globalAyahId += 1;
      }
   }

   const searchIndex: SearchIndexRecord[] = ayahs.map((ayah) => ({
      ...ayah,
      normalizedArabic: normalizeSearchText(ayah.arabic),
      normalizedTranslation: normalizeSearchText(ayah.translation),
   }));

   await Promise.all([
      fs.writeFile(
         path.join(OUTPUT_DATA_DIR, 'surahs.json'),
         JSON.stringify(surahs, null, 2)
      ),
      fs.writeFile(
         path.join(OUTPUT_DATA_DIR, 'ayahs.json'),
         JSON.stringify(ayahs, null, 2)
      ),
      fs.writeFile(
         path.join(OUTPUT_DATA_DIR, 'search-index.json'),
         JSON.stringify(searchIndex, null, 2)
      ),
   ]);

   console.log('Quran normalization completed successfully.');
   console.log(`Generated ${surahs.length} surahs`);
   console.log(`Generated ${ayahs.length} ayahs`);
   console.log(`Generated ${searchIndex.length} search records`);
   console.log(`Output directory: ${OUTPUT_DATA_DIR}`);
};

normalizeQuran().catch((error: unknown) => {
   console.error('Quran normalization failed');
   console.error(error);
   process.exit(1);
});
