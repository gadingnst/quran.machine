/* eslint-disable no-console */
import { Collection, MongoClient, Document, ObjectId, Db } from 'mongodb';
import {
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  IS_PRODUCTION
} from 'utils/config';

const MONGODB_URI =
  `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

abstract class Model<T> {
  protected abstract collectionName: string

  protected async connect(): Promise<Collection<Document>> {
    const client = new MongoClient(MONGODB_URI);
    let db: Db;
    if (!IS_PRODUCTION) {
      /*
        This comments copied from: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js
        In development mode, use a global variable so that the value
        is preserved across module reloads caused by HMR (Hot Module Replacement).
      */
      if (!global._db) {
        global._db = await client.connect()
          .then(() => (
            client.db(DB_NAME)
          ));
      }
      db = global._db;
    } else {
      // In production mode, it's best to not use a global variable.
      db = await client.connect()
        .then(() => (
          client.db(DB_NAME)
        ));
    }
    return db.collection(this.collectionName);
  }

  public async all(): Promise<T[]> {
    const collection = await this.connect();
    const data = await collection.find().toArray();
    return data as T[];
  }

  public async insert(data: T) {
    const collection = await this.connect();
    const insert = await collection.insertOne(data);
    return insert;
  }

  public async getById(id: number|string): Promise<T> {
    const collection = await this.connect();
    const data = await collection.findOne({ _id: new ObjectId(id) });
    return data as T;
  }

  public async updateById(id: number|string|ObjectId, data: Partial<T>) {
    const collection = await this.connect();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
      { upsert: true }
    );
    return result;
  }

  public async deleteById(id: number|string|ObjectId) {
    const collection = await this.connect();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
}

export default Model;
