const DEFAULT_RECITER = 'Alafasy_128kbps';
const EVERY_AYAH_BASE_URL = 'https://everyayah.com/data';

export const generateAudioUrl = (
   surah: number,
   ayah: number,
   reciter = DEFAULT_RECITER
): string => {
   const surahPart = surah.toString().padStart(3, '0');
   const ayahPart = ayah.toString().padStart(3, '0');

   return `${EVERY_AYAH_BASE_URL}/${reciter}/${surahPart}${ayahPart}.mp3`;
};
