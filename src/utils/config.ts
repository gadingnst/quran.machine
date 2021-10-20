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
  IG_SESSION,
  TELEGRAM_BOT_TOKEN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

export const IS_PRODUCTION = NODE_ENV === 'production';
export const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
export const SCREENSHOT_API = 'https://puppet.quran-machine.sutanlab.id';
export const WEBHOOK_URL = `${PUBLIC_URL}/api/telegram/webhook?token=${TELEGRAM_BOT_TOKEN}`;
export const COOKIES_PATH = process.cwd() + '/src/app/data/cookies.json';
export const PUBLIC_UPLOAD_PATH = 'https://res.cloudinary.com/sutanlab/image/upload/v1634705616/quran-machine';
