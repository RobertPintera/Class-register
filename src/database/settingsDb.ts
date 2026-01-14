import type { Settings } from "@/models/Settings";
import { db } from "./database";

export async function initSettingsDb(): Promise<void> {
  const existing = await db.settings.get("global");
  if (!existing) {
    await db.settings.add({
      id: "global",
      editWithDialog: false,
      frozenStudentInGrades: true
    });
  }
}

export async function getSettingsDb(): Promise<Settings | undefined> {
  return db.settings.get("global");
}

export async function updateSettingsDb(
  updatedFields: Partial<Omit<Settings, "id">>
): Promise<number> {
  return db.settings.update("global", updatedFields);
}