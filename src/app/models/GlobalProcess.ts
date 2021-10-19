import Model from './Model';

export interface GlobalProcessFields<T = string|number> {
  readonly _id?: T
  instance: 'telegram'|'instagram'
  isProcessing: boolean
}

class GlobalProcess extends Model<GlobalProcessFields> {
  protected collectionName = 'global-process'

  public async checkIsProcessing(instance: GlobalProcessFields['instance']) {
    const collection = await this.connect();
    const data = await collection.findOne({ instance });
    return data as GlobalProcessFields;
  }

  public async updateProcess(instance: GlobalProcessFields['instance'], process: boolean) {
    const collection = await this.connect();
    const result = await collection.updateOne(
      { instance },
      { $set: { isProcessing: process } },
      { upsert: true }
    );
    return result;
  }
}

export default new GlobalProcess();
