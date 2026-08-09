import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { localUserStore } from "@/lib/localUserStore";
import type { User } from "@/types/user";

function toPlainUser(doc: any): User {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id.toString(),
    createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() ?? obj.updatedAt,
  };
}

export const userService = {
  async list(): Promise<User[]> {
    if (isMongoConfigured()) {
      await connectDB();
      const docs = await UserModel.find({}).sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        ...d,
        _id: d._id.toString(),
        createdAt: d.createdAt?.toISOString?.() ?? d.createdAt,
        updatedAt: d.updatedAt?.toISOString?.() ?? d.updatedAt,
      })) as User[];
    }
    return localUserStore.list();
  },

  async findByEmail(email: string): Promise<User | null> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await UserModel.findOne({ email: email.toLowerCase() });
      return doc ? toPlainUser(doc) : null;
    }
    return localUserStore.findByEmail(email) ?? null;
  },

  async findById(id: string): Promise<User | null> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await UserModel.findById(id);
      return doc ? toPlainUser(doc) : null;
    }
    return localUserStore.findById(id) ?? null;
  },

  async create(data: { name: string; email: string; passwordHash: string }): Promise<User> {
    if (isMongoConfigured()) {
      await connectDB();
      const doc = await UserModel.create({ ...data, email: data.email.toLowerCase() });
      return toPlainUser(doc);
    }
    return localUserStore.create(data);
  },
};
