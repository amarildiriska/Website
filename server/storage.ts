import { transactions, type Transaction, type InsertTransaction } from "../shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface ITransactionStorage {
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  createTransaction(insertTransaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<boolean>;
}

export class DatabaseTransactionStorage implements ITransactionStorage {
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    try {
      await db.delete(transactions).where(eq(transactions.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }
}

export const transactionStorage = new DatabaseTransactionStorage();