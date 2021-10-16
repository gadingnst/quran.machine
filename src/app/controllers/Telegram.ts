import type { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';
import { Telegraf } from 'telegraf';
import Controller from './Controller';
import { TELEGRAM_API, TELEGRAM_BOT_TOKEN, WEBHOOK_URL } from 'utils/config';

interface TelegramUser {
  id: number
  first_name: string
  last_name: string
  username: string
}

interface TelegramSticker {
  width: number
  height: number
  emoji: string
  set_name: string
  is_animated: boolean
  thumb: {
    file_id: string
    file_unique_id: string
    file_size: number
    width: number
    height: number
  }
  file_id: string
  file_unique_id: string
  file_size: number
}

interface TelegramMessage {
  message_id: number
  from: TelegramUser & {
    is_bot: boolean
    language_code: string
  }
  chat: TelegramUser & { type: string } | {
    id: string
    title: string
    type: string
    all_members_are_administrators: boolean
  }
  date: Date|number
  text?: string
  sticker?: TelegramSticker
  entities?: {
    offset: number
    length: number
    type: string
  }[]
}

interface TelegramChannelPost {
  message_id: number,
  sender_chat: {
    id: number
    title: string
    type: string
  }
  chat: {
    id: number
    title: string
    type: string
  }
  date: Date|number
  text?: string
  sticker?: TelegramSticker
}

interface TelegramBotListenerResponse {
  update_id: number
  message?: TelegramMessage
  channel_post?: TelegramChannelPost
}

class TelegramController extends Controller {
  private bot = new Telegraf(TELEGRAM_BOT_TOKEN).telegram

  public webhookInit = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        data: payload
      } = await Axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
      this.sendJSON(res, {
        code: 200,
        message: 'OK.',
        payload
      });
    } catch (err) {
      this.handleError(res, err);
    }
  }

  public listen = async (req: NextApiRequest, res: NextApiResponse) => {
    const response: TelegramBotListenerResponse = req.body;
    // TODO handle message received
    // console.log(response)
    res.end();
  }
}

export default new TelegramController();