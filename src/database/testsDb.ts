import type { Test } from "@/models/Test";
import { db } from "./database";
import { liveQuery, type Observable } from "dexie";

export function getAllTestsDb(): Observable<Test[]> {
  return liveQuery(() => db.tests.toArray());
}

export async function addTestDb(test: Test): Promise<string> {
  return db.tests.add(test);
}

export async function updateTestDb(
  testId: string,
  updatedFields: Partial<Omit<Test, "id">>
): Promise<number> {
  return db.tests.update(testId, updatedFields);
}

export async function deleteTestAndGradesDb(testId: string): Promise<void> {
  await db.transaction("rw", db.tests, db.grades, async () => {
    await db.grades.where("testId").equals(testId).delete();
    await db.tests.delete(testId);
  });
}
