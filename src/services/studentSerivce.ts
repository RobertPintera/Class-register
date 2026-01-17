import type { Student } from "@/models/Student";
import { v4 as uuidv4 } from "uuid";
import { addStudentDb, deleteStudentAndGradesDb, updateStudentDb, getAllStudentsDb } from "@/database/studentsDb";

class StudentService {
  async getAllStudents(): Promise<Student[]> {
    return getAllStudentsDb();
  }

  async addStudent(student: Omit<Student, "id">): Promise<Student> {
    const newStudent: Student = { id: uuidv4(), ...student };
    await addStudentDb(newStudent);
    return newStudent;
  }

  async updateStudent(id: string, updated: Partial<Omit<Student, "id">>) {
    await updateStudentDb(id, updated);
  }

  async deleteStudent(studentId: string) {
    await deleteStudentAndGradesDb(studentId);
  }
}

export const studentService = new StudentService();
