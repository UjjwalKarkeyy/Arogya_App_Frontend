import * as SQLite from 'expo-sqlite';

export interface MedicinePlan {
  id?: number;
  name: string;
  dosage: string;
  duration: number;
  foodTiming: 'before' | 'after' | 'during';
  notificationTime: string;
  notificationsEnabled: boolean;
  lastNotificationDate?: string;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('medicine_reminder.db');
    this.initDatabase();
  }

  private initDatabase() {
    this.db.execSync(
      `CREATE TABLE IF NOT EXISTS medicine_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        duration INTEGER NOT NULL,
        foodTiming TEXT NOT NULL,
        notificationTime TEXT NOT NULL,
        notificationsEnabled INTEGER DEFAULT 1,
        lastNotificationDate TEXT
      );`
    );
    
    // Add the lastNotificationDate column if it doesn't exist (for existing databases)
    try {
      this.db.execSync('ALTER TABLE medicine_plans ADD COLUMN lastNotificationDate TEXT');
    } catch (error) {
      // Column already exists, ignore the error
    }
  }

  async getAllPlans(): Promise<MedicinePlan[]> {
    try {
      const rows = this.db.getAllSync('SELECT * FROM medicine_plans ORDER BY id DESC');
      const plans: MedicinePlan[] = rows.map((row: any) => ({
        ...row,
        notificationsEnabled: row.notificationsEnabled === 1
      }));
      return plans;
    } catch (error) {
      console.error('Error getting all plans:', error);
      return [];
    }
  }

  async savePlan(plan: MedicinePlan): Promise<number> {
    try {
      const result = this.db.runSync(
        `INSERT INTO medicine_plans (name, dosage, duration, foodTiming, notificationTime, notificationsEnabled)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          plan.name,
          plan.dosage,
          plan.duration,
          plan.foodTiming,
          plan.notificationTime,
          plan.notificationsEnabled ? 1 : 0
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error saving plan:', error);
      throw error;
    }
  }

  async updatePlan(plan: MedicinePlan): Promise<void> {
    try {
      this.db.runSync(
        `UPDATE medicine_plans SET name=?, dosage=?, duration=?, foodTiming=?, notificationTime=?, notificationsEnabled=?
         WHERE id=?`,
        [
          plan.name,
          plan.dosage,
          plan.duration,
          plan.foodTiming,
          plan.notificationTime,
          plan.notificationsEnabled ? 1 : 0,
          plan.id!
        ]
      );
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  async deletePlan(id: number): Promise<void> {
    try {
      this.db.runSync('DELETE FROM medicine_plans WHERE id=?', [id]);
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  async toggleNotifications(id: number, enabled: boolean): Promise<void> {
    try {
      this.db.runSync(
        'UPDATE medicine_plans SET notificationsEnabled=? WHERE id=?',
        [enabled ? 1 : 0, id]
      );
    } catch (error) {
      console.error('Error toggling notifications:', error);
      throw error;
    }
  }

  async decrementDuration(id: number): Promise<number> {
    try {
      // Get current duration
      const result = this.db.getFirstSync('SELECT duration FROM medicine_plans WHERE id=?', [id]) as any;
      if (!result) {
        throw new Error('Plan not found');
      }
      
      const newDuration = Math.max(0, result.duration - 1);
      
      // Update duration
      this.db.runSync(
        'UPDATE medicine_plans SET duration=? WHERE id=?',
        [newDuration, id]
      );
      
      // If duration reaches 0, disable notifications
      if (newDuration === 0) {
        await this.toggleNotifications(id, false);
      }
      
      return newDuration;
    } catch (error) {
      console.error('Error decrementing duration:', error);
      throw error;
    }
  }

  async getActivePlans(): Promise<MedicinePlan[]> {
    try {
      const rows = this.db.getAllSync(
        'SELECT * FROM medicine_plans WHERE notificationsEnabled = 1 AND duration > 0 ORDER BY id DESC'
      );
      const plans: MedicinePlan[] = rows.map((row: any) => ({
        ...row,
        notificationsEnabled: row.notificationsEnabled === 1
      }));
      return plans;
    } catch (error) {
      console.error('Error getting active plans:', error);
      return [];
    }
  }

  async updateLastNotificationDate(id: number, date: string): Promise<void> {
    try {
      this.db.runSync(
        'UPDATE medicine_plans SET lastNotificationDate=? WHERE id=?',
        [date, id]
      );
    } catch (error) {
      console.error('Error updating last notification date:', error);
      throw error;
    }
  }

  async getPlansNeedingUpdate(): Promise<MedicinePlan[]> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Get plans that haven't been updated today and are still active
      const rows = this.db.getAllSync(`
        SELECT * FROM medicine_plans 
        WHERE notificationsEnabled = 1 
        AND duration > 0 
        AND (lastNotificationDate IS NULL OR lastNotificationDate != ?)
        ORDER BY id DESC
      `, [today]);
      
      const plans: MedicinePlan[] = rows.map((row: any) => ({
        ...row,
        notificationsEnabled: row.notificationsEnabled === 1
      }));
      return plans;
    } catch (error) {
      console.error('Error getting plans needing update:', error);
      return [];
    }
  }
}

export const database = new DatabaseManager();

// Minimal default export so Expo Router doesn't treat this as a missing route.
// Does not render anything and does not affect the library usage above.
export default function DatabaseLibRoutePlaceholder() {
  return null;
}
