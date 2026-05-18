import type {
   AudioResponse,
   SurahAudioResponse,
} from '../types/quran.types.js';
import { generateAudioUrl } from '../utils/generateAudioUrl.js';
import { quranService } from './quran.service.js';

class AudioService {
   public getAudioUrl(surah: number, ayah: number): AudioResponse {
      quranService.getAyah(surah, ayah);

      return {
         surahNumber: surah,
         ayahNumber: ayah,
         audioUrl: generateAudioUrl(surah, ayah),
      };
   }

   public getSurahAudioUrls(surah: number): SurahAudioResponse {
      const surahWithAyahs = quranService.getSurahById(surah);

      return {
         surahNumber: surahWithAyahs.number,
         surahNameEnglish: surahWithAyahs.englishName,
         surahTranslatedName: surahWithAyahs.translatedName,
         totalAyahs: surahWithAyahs.totalAyahs,
         audioUrls: surahWithAyahs.ayahs.map((ayah) => ({
            surahNumber: ayah.surahNumber,
            ayahNumber: ayah.ayahNumber,
            audioUrl: ayah.audioUrl,
         })),
      };
   }
}

export const audioService = new AudioService();
