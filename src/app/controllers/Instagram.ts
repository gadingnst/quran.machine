/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getRandomAyatFairly, getScreenshot } from 'app/utils/Quran';
import InstagramSetup from 'app/utils/InstagramSetup';
import Controller from './Controller';

class InstagramController extends Controller {
  public publish = async (req: NextApiRequest, res: NextApiResponse) => {
    let processing = true;

    setTimeout(() => {
      if (processing) {
        processing = false;
        return this.sendJSON(res, {
          code: 202,
          message: 'Request accepted! (Process still running but request exited.)',
          error: false
        });
      }
    }, 9250);

    try {
      await this.publishPost();
      return processing && this.sendJSON(res, {
        code: 201,
        message: 'Success Publishing Post!',
        error: false
      });
    } catch (reason) {
      const { aspectRatioError, surah, ayat } = reason;

      if (aspectRatioError) {
        return processing && this.sendJSON(res, {
          code: 501,
          message: `Cannot publish surah because aspect ratio not match with instagram. On: Q.S. ${surah}:${ayat}`,
          error: true
        });
      }

      return processing && this.sendJSON(res, {
        code: 500,
        message: 'Something went wrong, try again later.',
        error: reason
      });
    } finally {
      processing = false;
    }
  }

  private getRandomTags() {
    let tags = '';
    const possibleTags = [
      'alquran', 'surah', 'ayatallah', 'muslim',
      'islam', 'quran', 'muhammad', 'islampost',
      'muslims', 'muslimpost', 'sunnah', 'alquransunnah',
      'alquranterjemahan', 'dakwahislam', 'remajaislami',
      'alhamdulillah', 'masyaallah', 'allahuakbar',
      'subhanallah', 'tabarakallah', 'tafsirsurah',
      'tafsirayat', 'tafsiralquran', 'tafsirquran',
      'tafsir', 'alqurandantafsir', 'tafsirindonesia'
    ];

    for (let i = 0; i < 10; i++) {
      tags += `#${possibleTags[
        ~~(Math.random() * possibleTags.length)
      ]} `;
    }

    return tags;
  }

  public async publishPost() {
    console.info('> Preparing surah...');
    const { surah, ayat, nameSurah, nameSurahId, tafsir, translation } = getRandomAyatFairly();

    let caption = `${translation} — ${nameSurah} (${nameSurahId}) [QS.${surah}:${ayat}]\n\nTafsir ringkas:\n${tafsir}\n.\n.\n${this.getRandomTags()}`;
    if (caption.length > 2200) {
      caption = `${translation} — ${nameSurah} (${nameSurahId}) [QS.${surah}:${ayat}]\n.\n.\n${this.getRandomTags()}`;
    }

    try {
      const file = await getScreenshot({ surah, ayat });
      console.info(`> Surah Prepared: Q.S ${surah}:${ayat}`);

      const { latitude, longitude, searchQuery } = {
        // set to jakarta location
        latitude: -6.121435,
        longitude: 106.774124,
        searchQuery: 'Jakarta, Indonesia',
      };

      console.info('> Publishing surah...');
      const instagram = await this.setup();
      const [location] = await instagram.search.location(latitude, longitude, searchQuery);
      const result = await instagram.publish.photo({ file, caption, location });
      console.info(`> Surah published at: ${new Date().toLocaleString()}.\n`);

      return result;
    } catch (reason) {
      const { response } = reason;
      if (response?.body) {
        const { message } = response.body;
        if (message.includes('aspect ratio')) {
          console.error('> Error on aspect ratio surah.');
          throw {
            aspectRatioError: true,
            surah,
            ayat
          };
        }
      }

      console.error('Error on publishing surah:', reason);
      throw new Error(reason);
    }
  }

  public setup = InstagramSetup
}

export default new InstagramController();
