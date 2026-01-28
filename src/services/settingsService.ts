import type { Settings } from "@/models/Settings";
import {
  initSettingsDb,
  getSettingsDb,
  updateSettingsDb
} from "@/database/settingsDb";
import type { Observable } from "dexie";

class SettingsService {
  async initSettings() {
    await initSettingsDb();
  }

  getSettings(): Observable<Settings | undefined> {
    return getSettingsDb();
  }

  async updateSettings(updatedFields: Partial<Omit<Settings, "id">>): Promise<number> {
    return updateSettingsDb(updatedFields);
  }
}

export const settingsService = new SettingsService();
