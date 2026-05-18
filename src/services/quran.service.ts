import type { Ayah, Surah, SurahWithAyahs } from '../types/quran.types.js';
import { AppError } from '../utils/AppError.js';
import { loadJsonFromDataDir } from '../utils/loadJson.js';

class QuranService {
   private readonly surahs: Surah[];
   private readonly ayahs: Ayah[];
   private readonly surahsById: Map<number, Surah>;
   private readonly ayahsBySurah: Map<number, Ayah[]>;
   private readonly ayahByReference: Map<string, Ayah>;

   constructor() {
      this.surahs = loadJsonFromDataDir<Surah[]>('surahs.json');
      this.ayahs = loadJsonFromDataDir<Ayah[]>('ayahs.json');

      this.surahsById = new Map(
         this.surahs.map((surah) => [surah.number, surah])
      );

      this.ayahsBySurah = new Map<number, Ayah[]>();
      this.ayahByReference = new Map<string, Ayah>();

      for (const ayah of this.ayahs) {
         const surahAyahs = this.ayahsBySurah.get(ayah.surahNumber) ?? [];
         surahAyahs.push(ayah);
         this.ayahsBySurah.set(ayah.surahNumber, surahAyahs);
         this.ayahByReference.set(
            this.getAyahKey(ayah.surahNumber, ayah.ayahNumber),
            ayah
         );
      }

      for (const surahAyahs of this.ayahsBySurah.values()) {
         surahAyahs.sort((a, b) => a.ayahNumber - b.ayahNumber);
      }
   }

   public getAllSurahs(): Surah[] {
      return this.surahs;
   }

   public getSurahById(id: number): SurahWithAyahs {
      const surah = this.surahsById.get(id);

      if (!surah) {
         throw new AppError(`Surah ${id} was not found`, 404);
      }

      return {
         ...surah,
         ayahs: this.getAyahsBySurah(id),
      };
   }

   public getAyahsBySurah(surahId: number): Ayah[] {
      const ayahs = this.ayahsBySurah.get(surahId);

      if (!ayahs) {
         throw new AppError(`Surah ${surahId} was not found`, 404);
      }

      return ayahs;
   }

   public getAyah(surah: number, ayah: number): Ayah {
      const foundAyah = this.ayahByReference.get(this.getAyahKey(surah, ayah));

      if (!foundAyah) {
         throw new AppError(`Ayah ${surah}:${ayah} was not found`, 404);
      }

      return foundAyah;
   }

   private getAyahKey(surah: number, ayah: number): string {
      return `${surah}:${ayah}`;
   }
}

export const quranService = new QuranService();
