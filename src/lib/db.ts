import { promises as fs } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { samplePackFor } from "@/lib/sample-pack";
import type { Database, StudyPack, User } from "@/lib/types";
import { monthKey, newId, nowIso } from "@/lib/utils";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureSeed(): Promise<Database> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "uploads"), { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    const passwordHash = await bcrypt.hash("lectura123", 10);
    const demo: User = {
      id: newId(),
      email: "demo@lectura.app",
      name: "Maya Chen",
      passwordHash,
      plan: "student",
      createdAt: nowIso(),
    };
    const db: Database = {
      users: [demo],
      packs: [samplePackFor(demo.id)],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return db;
  }
}

export function readDb() {
  return withLock(ensureSeed);
}

export function updateDb<T>(mutator: (db: Database) => T | Promise<T>) {
  return withLock(async () => {
    const db = await ensureSeed();
    const result = await mutator(db);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return result;
  });
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const db = await readDb();
  return db.users.find((user) => user.id === id) ?? null;
}

export async function packsForUser(userId: string) {
  const db = await readDb();
  return db.packs
    .filter((pack) => pack.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findPack(userId: string, packId: string) {
  const db = await readDb();
  return db.packs.find((pack) => pack.id === packId && pack.userId === userId) ?? null;
}

export async function countPacksThisMonth(userId: string) {
  const key = monthKey();
  const packs = await packsForUser(userId);
  return packs.filter((pack) => pack.createdAt.startsWith(key)).length;
}

export async function savePack(pack: StudyPack) {
  return updateDb((db) => {
    db.packs.unshift(pack);
    return pack;
  });
}

export async function saveUser(user: User) {
  return updateDb((db) => {
    db.users.push(user);
    return user;
  });
}
