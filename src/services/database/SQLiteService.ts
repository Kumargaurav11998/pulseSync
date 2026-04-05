import SQLite from 'react-native-sqlite-storage';
import { HealthMetric } from '../ble/bleDeviceConfig';

SQLite.enablePromise(true);

const database_name = "PulseSync.db";

export interface VitalRecord {
  id?: number;
  type: HealthMetric;
  value: string | number;
  unit: string;
  timestamp: string;
}

class SQLiteService {
  private db: any = null;
  private initPromise: Promise<any> | null = null;

  async initDB() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const db = await SQLite.openDatabase({
          name: database_name,
          location: 'default',
        });

        this.db = db;
        console.log("Database opened");
        await this.createTables();
        return this.db;
      } catch (error) {
        this.initPromise = null;
        console.error("Error opening database", error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  private async createTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS vitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        unit TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        last_connected DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE INDEX IF NOT EXISTS idx_vital_type ON vitals(type);`,
      `CREATE INDEX IF NOT EXISTS idx_vital_timestamp ON vitals(timestamp);`,
      `CREATE INDEX IF NOT EXISTS idx_device_last_connected ON devices(last_connected);`,
      `CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        displayName TEXT,
        email TEXT,
        photoURL TEXT,
        lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote TEXT NOT NULL,
        author TEXT,
        category TEXT
      );`
    ];

    for (const query of queries) {
      await this.db.executeSql(query);
    }
    console.log("Tables created successfully");
  }

  // Quote Management
  async saveQuote(quote: string, author: string, category: string) {
    const db = await this.initDB();
    const query = `INSERT INTO quotes (quote, author, category) VALUES (?, ?, ?)`;
    try {
      await db.executeSql(query, [quote, author, category]);
    } catch (error) {
      console.error('Error saving quote', error);
    }
  }

  async getQuotes(limit: number = 10) {
    const db = await this.initDB();
    const query = `SELECT * FROM quotes ORDER BY RANDOM() LIMIT ?`;
    try {
      const [results] = await db.executeSql(query, [limit]);
      const quotes = [];
      for (let i = 0; i < results.rows.length; i++) {
        quotes.push(results.rows.item(i));
      }
      return quotes;
    } catch (error) {
      console.error('Error fetching quotes', error);
      return [];
    }
  }

  async getQuoteCount() {
    const db = await this.initDB();
    const query = `SELECT COUNT(*) as count FROM quotes`;
    try {
      const [results] = await db.executeSql(query);
      return results.rows.item(0).count;
    } catch (error) {
      console.error('Error getting quote count', error);
      return 0;
    }
  }

  // User Management
  async saveUser(user: { uid: string, displayName?: string | null, email?: string | null, photoURL?: string | null }) {
    const db = await this.initDB();
    const query = `INSERT OR REPLACE INTO users (uid, displayName, email, photoURL, lastLogin) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    try {
      await db.executeSql(query, [user.uid, user.displayName, user.email, user.photoURL]);
      console.log(`User profile saved to SQLite: ${user.displayName} (${user.uid})`);
    } catch (error) {
      console.error('Error saving user profile', error);
    }
  }

  async getUser() {
    const db = await this.initDB();
    const query = "SELECT * FROM users LIMIT 1";
    try {
      const [results] = await db.executeSql(query);
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user', error);
      return null;
    }
  }

  async clearUserData() {
    const db = await this.initDB();
    try {
      await db.executeSql("DELETE FROM users");
      console.log("User data cleared from SQLite");
    } catch (error) {
      console.error('Error clearing user data', error);
    }
  }

  // Device Management
  async saveDevice(id: string, name: string, type: string = 'unknown') {
    const db = await this.initDB();
    const query = `INSERT OR REPLACE INTO devices (id, name, type, last_connected) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
    try {
      await db.executeSql(query, [id, name, type]);
      console.log(`Device saved to SQLite: ${name} (${id})`);
    } catch (error) {
      console.error('Error saving device', error);
    }
  }

  async getDevices() {
    const db = await this.initDB();
    const query = "SELECT * FROM devices ORDER BY last_connected DESC";
    try {
      const [results] = await db.executeSql(query);
      const devices = [];
      for (let i = 0; i < results.rows.length; i++) {
        devices.push(results.rows.item(i));
      }
      return devices;
    } catch (error) {
      console.error('Error fetching devices', error);
      return [];
    }
  }

  async removeDevice(id: string) {
    const db = await this.initDB();
    const query = "DELETE FROM devices WHERE id = ?";
    try {
      await db.executeSql(query, [id]);
      console.log(`Device removed: ${id}`);
    } catch (error) {
      console.error('Error removing device', error);
    }
  }

  async saveVital(record: VitalRecord) {
    const db = await this.initDB();
    const query = "INSERT INTO vitals (type, value, unit, timestamp) VALUES (?, ?, ?, ?)";
    const params = [record.type, record.value.toString(), record.unit, record.timestamp || new Date().toISOString()];
    
    try {
      await db.executeSql(query, params);
      console.log(`Saved ${record.type} to SQLite`);
    } catch (error) {
      console.error(`Error saving ${record.type}`, error);
    }
  }

  async getHistory(type: string, limit: number = 20) {
    const db = await this.initDB();
    const query = "SELECT * FROM vitals WHERE type = ? ORDER BY timestamp DESC LIMIT ?";
    
    try {
      const [results] = await db.executeSql(query, [type, limit]);
      const records: VitalRecord[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        records.push(results.rows.item(i));
      }
      return records;
    } catch (error) {
      console.error(`Error fetching history for ${type}`, error);
      return [];
    }
  }

  async getAllHistory(limit: number = 50) {
     const db = await this.initDB();
     const query = "SELECT * FROM vitals ORDER BY timestamp DESC LIMIT ?";
     
     try {
       const [results] = await db.executeSql(query, [limit]);
       const records: VitalRecord[] = [];
       for (let i = 0; i < results.rows.length; i++) {
         records.push(results.rows.item(i));
       }
       return records;
     } catch (error) {
       console.error("Error fetching all history", error);
       return [];
     }
  }

  async getTodayTotal(type: HealthMetric): Promise<number> {
    const db = await this.initDB();
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const query = "SELECT SUM(CAST(value as REAL)) as total FROM vitals WHERE type = ? AND timestamp LIKE ?";
    try {
      const [results] = await db.executeSql(query, [type, `${today}%`]);
      const total = results.rows.item(0).total || 0;
      return total;
    } catch (e) {
      console.error(`Error getting today total for ${type}`, e);
      return 0;
    }
  }

  async clearHistory(type?: string) {
    const db = await this.initDB();
    const query = type ? "DELETE FROM vitals WHERE type = ?" : "DELETE FROM vitals";
    const params = type ? [type] : [];
    
    try {
      await db.executeSql(query, params);
      console.log(`Cleared history ${type ? 'for ' + type : 'all'}`);
    } catch (error) {
      console.error("Error clearing history", error);
    }
  }
}

export default new SQLiteService();
