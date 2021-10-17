/* eslint-disable no-console */
// Key: {surah}.{ayat}
// Value: translation

import Axios from 'axios';
import { SCREENSHOT_API } from 'utils/config';
import quran from 'app/data/quran-tafsir.json';

export type ImageType = 'jpeg'|'png'

export type QuranJSON = {
  [key: string]: {
    surah: {
      arab: string
      latin: string
      id: string
    },
    text: {
      arab: string,
      id: string
    },
    tafsir: {
      short: string
      long: string
    }
  }
}

export type ScreenShotParams = {
  surah: number|string
  ayat: number|string
}

export const getRandomAyatFairly = () => {
  const flatAyats = Object.entries(quran);
  const [key, value] = flatAyats[~~(Math.random() * flatAyats.length)];
  const [surah, ayat] = key.split('.');
  const {
    surah: { latin: nameSurah, id: nameSurahId },
    text: { id: translation },
    tafsir: { short: tafsir }
  } = value;
  return {
    surah,
    ayat,
    nameSurah,
    nameSurahId,
    translation,
    tafsir
  };
};

export const getScreenshot = async (params: ScreenShotParams) => {
  const { surah, ayat } = params;
  try {
    const response = await Axios.get(`${SCREENSHOT_API}/screenshot/${surah}/${ayat}`, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data as string, 'base64');
    return buffer;
  } catch (err) {
    console.error({ err });
  }
};

const Quran = {
  getRandomAyatFairly,
  getScreenshot
};

export default Quran;
