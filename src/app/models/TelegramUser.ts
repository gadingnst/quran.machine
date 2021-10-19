import Model from './Model';

export interface TelegramUserFields<T = string|number> {
  readonly _id?: T
  id: number
  username: string
  first_name: string
  last_name: string
  language_code: string
  is_bot: boolean
  is_subscribed?: boolean
}

class TelegramUser extends Model<TelegramUserFields> {
  protected collectionName = 'telegram-users'

  public async syncUser(user: TelegramUserFields) {
    const { id } = user;
    const collection = await this.connect();
    const result = await collection.findOne({ id });
    if (result) {
      await collection.updateOne(
        { id },
        { $set: user },
        { upsert: true }
      );
    } else {
      await this.insert({
        ...user,
        is_subscribed: false
      });
    }
  }
}

export default new TelegramUser();
