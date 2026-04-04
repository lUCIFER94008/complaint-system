import { getDb } from "./mongodb";
import * as mockDb from "./mockdb";
import { Collection, Document } from "mongodb";

/**
 * Unified helper to get a collection from MongoDB or its equivalent from mockdb.
 * @param name - The collection name (e.g. 'complaints', 'users', 'feedback')
 * @returns An object with either the MongoDB collection OR the mock array.
 */
export async function getCollection<T extends Document>(name: 'complaints' | 'users' | 'feedback') {
  try {
    const db = await getDb();
    const collection = db.collection<T>(name);
    return { collection, mock: null as T[] | null };
  } catch (err) {
    // Failure to connect to MongoDB — fallback to mock
    console.debug(`Falling back to mockdb for collection: ${name}`);
    const mock = (mockDb as any)[name] as T[] | null;
    return { collection: null as Collection<T> | null, mock };
  }
}
