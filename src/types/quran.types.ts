export type RevelationType = 'meccan' | 'medinan' | string;

export type Surah = {
   number: number;
   arabicName: string;
   englishName: string;
   translatedName: string;
   revelationType: RevelationType;
   totalAyahs: number;
};

export type Ayah = {
   id: number;
   surahNumber: number;
   ayahNumber: number;
   arabic: string;
   translation: string;
   transliteration?: string;
   surahNameArabic: string;
   surahNameEnglish: string;
   surahTranslatedName: string;
   revelationType: RevelationType;
   audioUrl: string;
};

export type SurahWithAyahs = Surah & {
   ayahs: Ayah[];
};

export type SearchIndexRecord = Ayah & {
   normalizedArabic: string;
   normalizedTranslation: string;
};

export type SearchResult = {
   id: number;
   surahNumber: number;
   ayahNumber: number;
   arabic: string;
   translation: string;
   surahNameEnglish: string;
   surahTranslatedName: string;
   audioUrl: string;
   score?: number;
};

export type AudioResponse = {
   surahNumber: number;
   ayahNumber: number;
   audioUrl: string;
};

export type SurahAudioResponse = {
   surahNumber: number;
   surahNameEnglish: string;
   surahTranslatedName: string;
   totalAyahs: number;
   audioUrls: AudioResponse[];
};

export type APIResponse<T> = {
   success: boolean;
   message: string;
   data: T;
};

export type APIErrorResponse = {
   success: false;
   message: string;
   errors?: unknown;
};
