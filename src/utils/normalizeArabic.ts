const ARABIC_DIACRITICS =
   /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export const normalizeArabic = (value: string): string => {
   return value
      .normalize('NFKD')
      .replace(ARABIC_DIACRITICS, '')
      .replace(/[إأٱآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ـ/g, '')
      .replace(/\s+/g, ' ')
      .trim();
};

export const normalizeSearchText = (value: string): string => {
   return normalizeArabic(value).toLowerCase();
};
