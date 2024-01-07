import { Db, MongoClient } from "mongodb";
import CONFIG from "../app/utils/config.js";

const uri = CONFIG.MONGO_URL || '';
const dbName = CONFIG.DB_NAME || '';

let cachedClient, cachedDb;

export async function connect() {
  if (cachedClient && cachedDb) {
    console.log("reconnected to db")
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }
  if (!CONFIG.MONGO_URL) {
    throw new Error("URI is not defined in .env");
  }
  let client = new MongoClient(uri);
  await client.connect();
  let db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  console.log("Connected to db")
  return {
    client: cachedClient,
    db: cachedDb,
  };
}
