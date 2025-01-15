import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private db: SQLiteDBConnection | IDBPDatabase | null = null;
  private dbReady: Promise<void>;
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    this.dbReady = this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    if (this.isNative) {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      const conn = await sqlite.createConnection('golden-rat-db', false, 'no-encryption', 1, false);
      if (conn) {
        await conn.open();
        this.db = conn;
        await this.createTable();
      } else {
        throw new Error('Failed to create SQLite connection');
      }
    } else {
      this.db = await openDB('golden-rat-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('lotteries')) {
            db.createObjectStore('lotteries', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    }
  }

  private async createTable(): Promise<void> {
    if (this.isNative && this.db) {
      const query = `
        CREATE TABLE IF NOT EXISTS lotteries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL
        );
      `;
      await (this.db as SQLiteDBConnection).execute(query);
    }
  }

  async getAll(storeName: string): Promise<any[]> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const query = `SELECT * FROM ${storeName}`;
      const result = await (this.db as SQLiteDBConnection).query(query);
      return result.values || [];
    } else if (this.db) {
      return (await (this.db as IDBPDatabase).getAll(storeName)) || [];
    }
    throw new Error('Database not initialized');
  }

  async getById(storeName: string, id: number): Promise<any | null> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const query = `SELECT * FROM ${storeName} WHERE id = ?`;
      const result = await (this.db as SQLiteDBConnection).query(query, [id]);
      return result.values?.[0] || null;
    } else if (this.db) {
      return await (this.db as IDBPDatabase).get(storeName, id);
    }
    throw new Error('Database not initialized');
  }

  async add(storeName: string, data: any): Promise<number | void> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      const query = `INSERT INTO ${storeName} (${keys}) VALUES (${placeholders})`;
      await (this.db as SQLiteDBConnection).run(query, values);
    } else if (this.db) {
      const id = await (this.db as IDBPDatabase).add(storeName, data);
      if (typeof id === 'number') {
        return id;
      }
    }
    throw new Error('Failed to add record');
  }
  
  async update(storeName: string, data: any): Promise<void> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const keys = Object.keys(data)
        .filter((key) => key !== 'id')
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(data).filter((_, index) => index !== 0);
      values.push(data.id);
      const query = `UPDATE ${storeName} SET ${keys} WHERE id = ?`;
      await (this.db as SQLiteDBConnection).run(query, values);
    } else if (this.db) {
      await (this.db as IDBPDatabase).put(storeName, data);
    } else {
      throw new Error('Database not initialized');
    }
  }

  async delete(storeName: string, id: number): Promise<void> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const query = `DELETE FROM ${storeName} WHERE id = ?`;
      await (this.db as SQLiteDBConnection).run(query, [id]);
    } else if (this.db) {
      await (this.db as IDBPDatabase).delete(storeName, id);
    } else {
      throw new Error('Database not initialized');
    }
  }
}
