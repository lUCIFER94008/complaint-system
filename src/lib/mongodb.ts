import { Db, MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

async function createMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing environment variable MONGODB_URI");
  }

  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function getDb(): Promise<Db> {
  if (globalForMongo._mongoDb) return globalForMongo._mongoDb;

  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = await createMongoClient();
  }

  const dbName = process.env.MONGODB_DB;
  if (!dbName) {
    throw new Error("Missing environment variable MONGODB_DB");
  }

  globalForMongo._mongoDb = globalForMongo._mongoClient.db(dbName);
  return globalForMongo._mongoDb;
}

