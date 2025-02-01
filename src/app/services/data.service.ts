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
        await this.createTables();
      } else {
        throw new Error('Failed to create SQLite connection');
      }
    } else {
      this.db = await openDB('golden-rat-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('clients')) {
            db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('lotteries')) {
            db.createObjectStore('lotteries', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('lottery_multipliers')) {
            db.createObjectStore('lottery_multipliers', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('lottery_options')) {
            db.createObjectStore('lottery_options', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('lottery_schedules')) {
            db.createObjectStore('lottery_schedules', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('lottery_results')) {
            db.createObjectStore('lottery_results', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('bets')) {
            db.createObjectStore('bets', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('tickets')) {
            db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    }
  }

  private async createTables(): Promise<void> {
    if (this.isNative && this.db) {
      const queries = [
        `
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          max_bet_amount INTEGER NOT NULL
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          alias TEXT NOT NULL,
          phone TEXT NOT NULL UNIQUE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS lotteries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS lottery_options (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lottery_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          payout_multiplier REAL,
          FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS lottery_multipliers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lottery_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          multiplier REAL NOT NULL,
          FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS lottery_schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lottery_id INTEGER NOT NULL,
          day_of_week TEXT NOT NULL,
          time TEXT NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS lottery_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lottery_id INTEGER NOT NULL,
          lottery_schedule_id INTEGER NOT NULL,
          lottery_option_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE
          FOREIGN KEY (lottery_schedule_id) REFERENCES lottery_schedules(id) ON DELETE CASCADE,
          FOREIGN KEY (lottery_option_id) REFERENCES lottery_options(id) ON DELETE CASCADE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS bets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lottery_id INTEGER NOT NULL,
          lottery_schedule_id INTEGER NOT NULL,
          lottery_option_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          date TEXT NOT NULL,
          status TEXT DEFAULT 'pending', -- 'pending', 'winner', 'loser'
          type TEXT NOT NULL,
          multiplier REAL NOT NULL,
          payout_amount REAL DEFAULT 0,
          is_paid BOOLEAN DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE,
          FOREIGN KEY (lottery_schedule_id) REFERENCES lottery_schedules(id) ON DELETE CASCADE,
          FOREIGN KEY (lottery_option_id) REFERENCES lottery_options(id) ON DELETE CASCADE
        );
        `,
        `
        CREATE TABLE IF NOT EXISTS tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          total_amount REAL NOT NULL,
          status TEXT DEFAULT 'pending', -- 'pending', 'winner', 'loser'
          payout_amount REAL DEFAULT 0,
          is_paid BOOLEAN DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );
        `
      ];
      for (const query of queries) {
        await (this.db as SQLiteDBConnection).execute(query);
      }
    }
    await this.ensureDefaultSettings();
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

  async add(storeName: string, data: any): Promise<any> {
    await this.dbReady;
    if (this.isNative && this.db) {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      const query = `INSERT INTO ${storeName} (${keys}) VALUES (${placeholders})`;
      await (this.db as SQLiteDBConnection).run(query, values);

      const lastIdQuery = `SELECT last_insert_rowid() as id`;
      const result = await (this.db as SQLiteDBConnection).query(lastIdQuery);
      const id = result.values?.[0]?.id;
      return { id, ...data };
    } else if (this.db) {
      const id = await (this.db as IDBPDatabase).add(storeName, data);
      return { id, ...data };
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

  private async ensureDefaultSettings(): Promise<void> {
    const query = `SELECT COUNT(*) as count FROM settings`;
    const result = await (this.db as SQLiteDBConnection).query(query);
    const count = result.values?.[0]?.count || 0;

    if (count === 0) {
      const insertQuery = `
        INSERT INTO settings (id, max_bet_amount) VALUES (1, 100);
      `;
      await (this.db as SQLiteDBConnection).run(insertQuery);
    }
  }
}
