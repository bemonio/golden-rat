import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class LotteryService {
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.initDB();
  }

  async initDB() {
    try {
      const dbName = 'golden_rat_db';
      this.db = await CapacitorSQLite.createConnection({
        database: dbName,
        version: 1,
        encrypted: false,
        mode: 'no-encryption',
      });
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS lotteries (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT CHECK(type IN ('numbers', 'animalitos')),
          schedule TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async addLottery(lottery: { name: string; type: string; schedule: string }) {
    if (!this.db) return;
    const query = `
      INSERT INTO lotteries (name, type, schedule)
      VALUES (?, ?, ?);
    `;
    const values = [lottery.name, lottery.type, lottery.schedule];
    await this.db.run(query, values);
  }

  async getLotteries() {
    if (!this.db) return [];
