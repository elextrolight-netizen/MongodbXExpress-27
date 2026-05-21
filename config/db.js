const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "kampus_db";

let db;

const connectDB = async () => {
  const client = await MongoClient.connect(MONGO_URI);
  db = client.db(DB_NAME);
  console.log(`✅ Terhubung ke MongoDB — database: ${DB_NAME}`);
};

const getDB = () => {
  if (!db) throw new Error("Database belum terhubung!");
  return db;
};

module.exports = { connectDB, getDB };
