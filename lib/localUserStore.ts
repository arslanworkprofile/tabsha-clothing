import fs from "fs";
import path from "path";
import { User } from "@/types/user";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

interface DBShape {
  users: User[];
}

function readDB(): DBShape {
  if (!fs.existsSync(DB_PATH)) {
    const seeded: DBShape = { users: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw) as DBShape;
  } catch {
    const seeded: DBShape = { users: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

function writeDB(db: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function genId() {
  return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const localUserStore = {
  list(): User[] {
    return readDB().users;
  },
  findByEmail(email: string): User | undefined {
    return readDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findById(id: string): User | undefined {
    return readDB().users.find((u) => u._id === id);
  },
  create(data: { name: string; email: string; passwordHash: string }): User {
    const db = readDB();
    const now = new Date().toISOString();
    const user: User = {
      _id: genId(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(user);
    writeDB(db);
    return user;
  },
};
