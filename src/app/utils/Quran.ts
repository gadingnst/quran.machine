/* eslint-disable no-console */
// Key: {surah}.{ayat}
// Value: translation

import Axios from 'axios';
import Jimp from 'jimp';
import { SCREENSHOT_API } from 'utils/config';
import quran from 'app/data/quran-tafsir.json';
import { getVersesPath, uploadFromBuffer } from './Cloudinary';

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
  options?: {
    mode: 'light'|'dark'
  }
}

const possibleMode = ['light', 'dark'];
const possibleColors = ['red', 'green', 'blue'];

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

const imgToBuffer = (data: string|unknown) => Buffer.from(data as string, 'base64');
const requestBuffer = (url: string) =>
  Axios.get(url, { responseType: 'arraybuffer' });

export const getScreenshot = async (params: ScreenShotParams) => {
  const { surah, ayat, options } = params;
  const { mode: modeParam } = options || {};

  const mode = modeParam || possibleMode[~~(Math.random() * possibleMode.length)];

  const doGetScreenshot = async () => {
    const resp = await requestBuffer(`${SCREENSHOT_API}/screenshot/${surah}/${ayat}?mode=${mode}`);
    const bufferImg = imgToBuffer(resp.data);
    uploadFromBuffer(bufferImg, {
      name: ayat,
      folder: `verses/${mode}/${surah}`
    });
    return bufferImg;
  };

  try {
    const buffer = await requestBuffer(getVersesPath(surah, ayat, { mode }))
      .then((res) => {
        if (res?.data) return imgToBuffer(res.data);
        return doGetScreenshot();
      })
      .catch(doGetScreenshot);

    const image = await Jimp.read(buffer);
    return image
      .color([{
        apply: possibleColors[~~(Math.random() * possibleColors.length)] as any,
        params: [~~(Math.random() * 100)]
      }])
      .getBufferAsync(Jimp.AUTO as any);
  } catch (err) {
    console.error({ err });
    throw err;
  }
};

const Quran = {
  getRandomAyatFairly,
  getScreenshot
};

export default Quran;
