import type { Settings } from "@/models/Settings";
import {
  initSettingsDb,
  getSettingsDb,
  updateSettingsDb
} from "@/database/settingsDb";

class SettingsService {
  async initSettings() {
    await initSettingsDb();
  }

  async getSettings(): Promise<Settings | undefined> {
    return getSettingsDb();
  }

  async updateSettings(updatedFields: Partial<Omit<Settings, "id">>): Promise<number> {
    return updateSettingsDb(updatedFields);
  }
}

export const settingsService = new SettingsService();
