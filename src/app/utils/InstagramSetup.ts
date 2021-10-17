/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

import Fs from 'fs';
import { IgApiClient } from 'instagram-private-api';
import { IG_PROXY, IG_USERNAME, IG_PASSWORD, COOKIES_PATH, IG_SESSION } from '../../utils/config';

const InstagramSetup = async (generator = false) => {
  const ig = new IgApiClient();
  IG_PROXY && (ig.state.proxyUrl = IG_PROXY);
  IG_USERNAME && ig.state.generateDevice(IG_USERNAME);

  try {
    const flag = { cache: true };
    if (!generator) throw flag;

    console.info('> Checking Cookies...');
    if (Fs.existsSync(COOKIES_PATH)) {
      console.info('> Login Skipped, Cookies Exists!');
      throw flag;
    }

    const runTask = async (): Promise<any> => {
      try {
        console.info('> Logging In...');
        await ig.simulate.preLoginFlow();
        await ig.account.login(IG_USERNAME as string, IG_PASSWORD as string);
        const cookies = await ig.state.serializeCookieJar();
        await Fs.promises.writeFile(COOKIES_PATH, JSON.stringify(cookies));
        console.info('> Login Cookies Stored!\n');
      } catch (reason) {
        const { response } = reason;

        if (response?.body) {
          const { message } = response.body;
          if (message.includes('try again')) {
            console.error('> Too many request, will trying again in 8s...\n');
            return setTimeout(runTask, 8000);
          }
        }

        throw reason;
      }
    };

    await runTask();
  } catch (reason) {
    if (!generator) {
      if (!reason.cache) throw reason;
      const loginCookies = IG_SESSION || await Fs.promises.readFile(COOKIES_PATH, { encoding: 'utf-8' });
      await ig.state.deserializeCookieJar(loginCookies);
    }
  }

  return ig;
};

export default InstagramSetup;
