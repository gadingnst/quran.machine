/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';
import { Telegraf } from 'telegraf';
import Controller from './Controller';
import Instagram from './Instagram';
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

let processing = false;

class TelegramController extends Controller {
  private bot = () => new Telegraf(TELEGRAM_BOT_TOKEN).telegram

  private webhookInit = async () => {
    const { data } = await Axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    return data;
  }

  public init = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const payload = await this.webhookInit();
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
    const bot = this.bot();
    if (response?.message) {
      const [command] = response?.message?.text.split(' ');
      const commandList = {
        '/start': this.botStart,
        '/restart': this.botStart,
        '/publish': this.publishRandom
      };
      if (command in commandList) {
        await commandList[command](response);
      } else {
        await bot.sendMessage(response.message.chat.id, 'I don\'t get it. Please use only command on the list.');
      }
    }
    res.end();
  }

  private botStart = async (response: TelegramBotListenerResponse) => {
    const bot = this.bot();
    await this.webhookInit();
    return bot.sendMessage(response.message.chat.id, 'Hello 👋. You can command me from the command list.');
  }

  private publishRandom = async (response: TelegramBotListenerResponse) => {
    const bot = this.bot();
    const chatId = response.message.chat.id;
    if (!processing) {
      processing = true;
      try {
        const processMsg = await bot.sendMessage(chatId, 'Please wait...');
        const result = await Instagram.publishPost();
        const postUrl = `https://www.instagram.com/p/${result.media.code}`;
        await bot.deleteMessage(chatId, processMsg.message_id);
        setTimeout(() => {
          processing = false;
        }, 60000);
        return bot.sendMessage(chatId, `Done! you can see the post in: ${postUrl}`);
      } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, `Something went wrong. Try again later. (${JSON.stringify(err, null, 2)})`);
      }
    } else {
      await bot.sendMessage(response.message.chat.id, 'To prevent spam, please wait at least 60seconds until other process done. Thank you.');
    }
  }
}

export default new TelegramController();
