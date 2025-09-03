import { openDB } from "idb";

const DB_NAME = "authDB";
const STORE_NAME = "tokens";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveToken(token: string) {
  const db = await getDB();
  await db.put(STORE_NAME, token, "authToken");
}

export async function getToken(): Promise<string | null> {
  const db = await getDB();
  return (await db.get(STORE_NAME, "authToken")) || null;
}

export async function clearToken() {
  const db = await getDB();
  await db.delete(STORE_NAME, "authToken");
}
