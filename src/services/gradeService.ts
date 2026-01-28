import { addGradeDb, deleteGradeDb, deleteGradesByTestDb, getAllGradesDb, updateGradeDb } from "@/database/gradesDb";
import type { Grade } from "@/models/Grade";
import type { Observable } from "dexie";

class GradeService {
  getAllGrades(): Observable<Grade[]> {
    return getAllGradesDb();
  }

  async addGrade(grade: Grade): Promise<string> {
    return await addGradeDb(grade);
  }

  async updateGrade(testId: string, studentId: string, updatedFields: Partial<Omit<Grade, "testId" | "studentId">>): Promise<number> {
    return await updateGradeDb(testId, studentId, updatedFields);
  }

  async deleteGrade(studentId: string, testId: string): Promise<void> {
    return await deleteGradeDb(studentId, testId);
  }

  async deleteGradesByTest(testId: string): Promise<void> {
    await deleteGradesByTestDb(testId);
  }
}

export const gradeService = new GradeService();
