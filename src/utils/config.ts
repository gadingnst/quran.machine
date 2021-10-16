import BASE_PATH from '../../basepath';

export const {
  NODE_ENV = 'production',
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  PUBLIC_URL,
  SECRET_KEY,
  IG_PROXY,
  IG_USERNAME,
  IG_PASSWORD,
  TELEGRAM_BOT_TOKEN
} = process.env;

export const IS_PRODUCTION = NODE_ENV === 'production';
export const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
export const WEBHOOK_URL = `${PUBLIC_URL}/api/telegram/webhook?token=${TELEGRAM_BOT_TOKEN}`;
export const COOKIES_PATH = BASE_PATH + '/src/app/data/cookies.json';
