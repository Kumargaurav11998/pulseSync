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
      `CREATE INDEX IF NOT EXISTS idx_device_last_connected ON devices(last_connected);`
    ];

    for (const query of queries) {
      await this.db.executeSql(query);
    }
    console.log("Tables created successfully");
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
