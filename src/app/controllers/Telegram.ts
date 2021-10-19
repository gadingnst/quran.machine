/* eslint-disable no-console */

import type { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';
import { Telegraf } from 'telegraf';
import Controller from './Controller';
import Instagram from './Instagram';
import { TELEGRAM_API, TELEGRAM_BOT_TOKEN, WEBHOOK_URL } from 'utils/config';
import GlobalProcess from 'app/models/GlobalProcess';
import TelegramUser from 'app/models/TelegramUser';

/*
  BOT COMMANDS
  start - Awake the bot.
  publish - Publish random verses to Instagram.
  rules - See bot rules and limitations.
*/

interface ServerParams {
  req?: NextApiRequest
  res?: NextApiResponse
}
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

  private webhookInit = async () => {
    const { data } = await Axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    return data;
  }

  private webhookFlush = async () => {
    const [{ data }] = await Promise.all([
      Axios.get(`${TELEGRAM_API}/deleteWebhook?drop_pending_updates=true`),
      this.setGlobalProcess(false)
    ]);
    return data;
  }

  public init = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await this.webhookFlush();
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
    const bot = this.bot;
    if (response?.message) {
      const [command] = response?.message?.text?.split(' ') || [];
      const commandList = {
        '/start': this.botStart,
        '/publish': this.publish,
        '/rules': this.rules
      };
      if (command && command in commandList) {
        await commandList[command](response, { req, res } as ServerParams);
      } else {
        bot.sendMessage(response.message.chat.id, 'I don\'t get it. Please use only command on the "Menu" list.');
      }
    }
    res.end();
  }

  private botStart = async (response: TelegramBotListenerResponse) => {
    await TelegramUser.syncUser(response.message.from);
    return this.bot
      .sendMessage(
        response.message.chat.id,
        `Hello ${response.message.from.first_name} 👋. You can see all commands from the "Menu" list.`
      );
  }

  private publish = async (response: TelegramBotListenerResponse) => {
    const bot = this.bot;
    const chatId = response.message.chat.id;
    const isProcessing = await this.getGlobalProcess();
    if (!isProcessing) {
      try {
        this.setGlobalProcess(true);
        const processMsg = await bot.sendMessage(response.message.chat.id, 'Please wait...');
        setTimeout(() => {
          this.setGlobalProcess(false);
        }, 60000 * 5);
        setTimeout(() => {
          bot.deleteMessage(chatId, processMsg.message_id);
          bot.sendMessage(
            chatId,
            `I've receive your /publish command. But still processing on it. If there's no Done response from me, you can check the newest post in https://www.instagram.com/quran.machine/. Maybe the newest is your requests, thank you. ☺️`
          );
        }, 7000);
        return Instagram.publishPost().then((result) => {
          const postUrl = `https://www.instagram.com/p/${result.media.code}`;

          return bot.sendMessage(chatId, `Done! you can see the post in: ${postUrl}`);
        });
      } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, `Something went wrong. Try again later. (${JSON.stringify(err, null, 2)})`);
      }
    }
  }

  private rules = async (response: TelegramBotListenerResponse) => {
    return this.bot.sendMessage(
      response.message.chat.id,
      '--- BOT RULES ---\n' +
      '\n\n- If the Bot doesn\'t response you, please be patient. Bot needs time to awake, at least 5 minutes.' +
      '\n\n- To prevent spam, please wait at least 5 minutes until other publish process done. (Bot will not response /publish command for 5 minutes).'
    );
  }

  private getGlobalProcess = async () => {
    const data = await GlobalProcess.checkIsProcessing('telegram');
    if (!data) {
      await GlobalProcess.insert({ instance: 'telegram', isProcessing: false });
      return false;
    }
    return data.isProcessing;
  }

  private setGlobalProcess = async (process: boolean) =>
    GlobalProcess.updateProcess('telegram', process)
}

export default new TelegramController();
