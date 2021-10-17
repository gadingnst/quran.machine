import type { NextApiRequest, NextApiResponse } from 'next';
import { TELEGRAM_BOT_TOKEN } from 'utils/config';

const verifyTelegramBotToken = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const { token } = req.query;
  if (token === TELEGRAM_BOT_TOKEN) return next();
  return res.status(400).send({
    code: 403,
    message: 'Access Forbidden.',
    error: true
  });
};

export default verifyTelegramBotToken;
