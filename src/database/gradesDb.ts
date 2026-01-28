import type { Grade } from "@/models/Grade";
import { db } from "./database";
import { liveQuery, type Observable } from "dexie";

export function getAllGradesDb(): Observable<Grade[]> {
  return liveQuery(() => db.grades.toArray());
}

export async function addGradeDb(grade: Grade): Promise<string> {
  return db.grades.add(grade);
}

export async function updateGradeDb(
  testId: string,
  studentId: string,
  updatedFields: Partial<Omit<Grade, "testId" | "studentId">>
): Promise<number> {
  return db.grades.update([studentId, testId], { ...updatedFields });
}

export async function deleteGradeDb(studentId: string, testId: string): Promise<void> {
  return db.grades.delete([studentId, testId]);
}

export async function deleteGradesByTestDb(testId: string): Promise<void> {
  await db.grades.where("testId").equals(testId).delete();
}