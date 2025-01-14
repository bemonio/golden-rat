import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private db: any;

  constructor() {
    this.initializeDB();
  }

  async initializeDB() {
    if (this.isWeb()) {
      // Inicializa IndexedDB
      const { openDB } = await import('idb');
      this.db = await openDB('golden-rat-db', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('lotteries')) {
            db.createObjectStore('lotteries', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    } else {
      // Inicializa SQLite en Android
      const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      this.db = await sqlite.createConnection('golden-rat-db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS lotteries (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT CHECK(type IN ('number', 'animal'))
        );
      `);
    }
  }

  async getAll(storeName: string): Promise<any[]> {
    if (this.isWeb()) {
      return (await this.db.getAll(storeName)) || [];
    } else {
      const result = await this.db.query(`SELECT * FROM ${storeName}`);
      return result.values || [];
    }
  }

  async getById(storeName: string, id: number): Promise<any> {
    if (this.isWeb()) {
      return await this.db.get(storeName, id);
    } else {
      const result = await this.db.query(`SELECT * FROM ${storeName} WHERE id = ?`, [id]);
      return result.values[0] || null;
    }
  }

  async add(storeName: string, data: any): Promise<any> {
    if (this.isWeb()) {
      return await this.db.add(storeName, data);
    } else {
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      await this.db.run(`INSERT INTO ${storeName} (${keys}) VALUES (${placeholders})`, values);
    }
  }

  async update(storeName: string, data: any): Promise<any> {
    if (this.isWeb()) {
      return await this.db.put(storeName, data);
    } else {
      const keys = Object.keys(data).map((key) => `${key} = ?`).join(', ');
      const values = Object.values(data);
      values.push(data.id);
      await this.db.run(`UPDATE ${storeName} SET ${keys} WHERE id = ?`, values);
    }
  }

  async delete(storeName: string, id: number): Promise<any> {
    if (this.isWeb()) {
      return await this.db.delete(storeName, id);
    } else {
      await this.db.run(`DELETE FROM ${storeName} WHERE id = ?`, [id]);
    }
  }

  private isWeb(): boolean {
    return !('Capacitor' in window);
  }
}
