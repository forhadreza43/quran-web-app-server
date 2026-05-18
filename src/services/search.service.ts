import Fuse from 'fuse.js';
import type {
   SearchIndexRecord,
   SearchResult,
} from '../types/quran.types.js';
import { loadJsonFromDataDir } from '../utils/loadJson.js';
import { normalizeSearchText } from '../utils/normalizeArabic.js';

class SearchService {
   private readonly fuse: Fuse<SearchIndexRecord>;
   private readonly resultCache = new Map<string, SearchResult[]>();
   private readonly maxCacheEntries = 100;

   constructor() {
      const searchIndex =
         loadJsonFromDataDir<SearchIndexRecord[]>('search-index.json');

      this.fuse = new Fuse(searchIndex, {
         includeScore: true,
         shouldSort: true,
         ignoreLocation: true,
         threshold: 0.32,
         minMatchCharLength: 2,
         keys: [
            { name: 'normalizedArabic', weight: 0.45 },
            { name: 'arabic', weight: 0.25 },
            { name: 'normalizedTranslation', weight: 0.2 },
            { name: 'translation', weight: 0.2 },
            { name: 'surahNameEnglish', weight: 0.05 },
            { name: 'surahTranslatedName', weight: 0.05 },
         ],
      });
   }

   public search(query: string, limit: number): SearchResult[] {
      const normalizedQuery = normalizeSearchText(query);
      const cacheKey = `${normalizedQuery}:${limit}`;
      const cachedResults = this.resultCache.get(cacheKey);

      if (cachedResults) {
         return cachedResults;
      }

      const results = this.fuse.search(normalizedQuery, { limit }).map((result) => ({
         id: result.item.id,
         surahNumber: result.item.surahNumber,
         ayahNumber: result.item.ayahNumber,
         arabic: result.item.arabic,
         translation: result.item.translation,
         surahNameEnglish: result.item.surahNameEnglish,
         surahTranslatedName: result.item.surahTranslatedName,
         audioUrl: result.item.audioUrl,
         score: result.score,
      }));

      this.resultCache.set(cacheKey, results);

      if (this.resultCache.size > this.maxCacheEntries) {
         const oldestKey = this.resultCache.keys().next().value;

         if (oldestKey) {
            this.resultCache.delete(oldestKey);
         }
      }

      return results;
   }
}

export const searchService = new SearchService();
