import type { Student } from "@/models/Student";
import { db } from "./database";

export async function getAllStudentsDb(): Promise<Student[]> {
  return db.students.toArray();
}

export async function addStudentDb(student: Student): Promise<string> {
  return db.students.add(student);
}

export async function updateStudentDb(
  studentId: string,
  updatedFields: Partial<Omit<Student, "id">>
): Promise<number> {
  return db.students.update(studentId, updatedFields);
}

export async function deleteStudentAndGradesDb(studentId: string): Promise<void> {
  await db.transaction("rw", db.students, db.grades, async () => {
    await db.grades.where("studentId").equals(studentId).delete();
    await db.students.delete(studentId);
  });
}