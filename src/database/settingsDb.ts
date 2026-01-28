import type { Settings } from "@/models/Settings";
import { db } from "./database";
import { liveQuery, type Observable } from "dexie";

export async function initSettingsDb(): Promise<void> {
  const existing = await db.settings.get("global");
  if (!existing) {
    await db.settings.add({
      id: "global",
      editWithDialog: false,
      frozenStudentInGrades: true,
      lowestGradeForTestMandatory: false,
      lowestGradeForTestFailed: false
    });
  }
}

export function getSettingsDb(): Observable<Settings | undefined>{
  return liveQuery(() => db.settings.get("global"));
}

export async function updateSettingsDb(
  updatedFields: Partial<Omit<Settings, "id">>
): Promise<number> {
  return db.settings.update("global", updatedFields);
}