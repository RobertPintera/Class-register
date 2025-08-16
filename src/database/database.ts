import Dexie from "dexie";
import type { Table } from "dexie";
import { v4 as uuidv4 } from "uuid";
import type { Student } from "../models/Student";
import type { Test } from "../models/Test";
import type { Grade } from "../models/Grade";
import type { GradeThreshold } from "@/models/GradeThreshold";
import type { Settings } from "@/models/Settings";

export class Database extends Dexie {
  students: Table<Student>;
  tests: Table<Test>;
  grades: Table<Grade>;
  thresholds: Table<GradeThreshold>;
  settings: Table<Settings>;

  constructor() {
    super("Database");

    this.version(1).stores({
      students: "id",
      tests: "id",
      grades: "[studentId+testId], studentId, testId",
      thresholds: "id",
      settings: "id",
    });

    this.students = this.table("students");
    this.tests = this.table("tests");
    this.grades = this.table("grades");
    this.thresholds = this.table("thresholds");
    this.settings = this.table("settings");
  }

  async createDemoData(){
    await this.transaction("rw", this.students, this.tests, this.grades, async () => {
      await this.students.clear();
      await this.tests.clear();
      await this.grades.clear();

      const students: Student[] = [
        { id: uuidv4(), name: "Jan", surname: "Kowalski", gender: "Male" },
        { id: uuidv4(), name: "John", surname: "Smith", gender: "Male" },
        { id: uuidv4(), name: "William", surname: "Brown", gender: "Male" },
        { id: uuidv4(), name: "Daniel", surname: "Novak", gender: "Male" },
        { id: uuidv4(), name: "Katarzyna", surname: "Wiśniewska", gender: "Female" },
        { id: uuidv4(), name: "Emily", surname: "Johnson", gender: "Female" },
        { id: uuidv4(), name: "Sofia", surname: "Rossi", gender: "Female" },
        { id: uuidv4(), name: "Maria", surname: "Silva", gender: "Female" },
      ];

      const tests: Test[] = [
        { id: uuidv4(), name: "Math - Algebra", maxPoints: 20, weight: 2, requiredPoints: 10 },
        { id: uuidv4(), name: "English - Grammar", maxPoints: 15, weight: 1, requiredPoints: 8 },
        { id: uuidv4(), name: "History - Ancient Rome", maxPoints: 25, weight: 3, requiredPoints: null },
        { id: uuidv4(), name: "Science - Physics Basics", maxPoints: 30, weight: 2, requiredPoints: 15 },
        { id: uuidv4(), name: "Geography - Europe", maxPoints: 20, weight: 1, requiredPoints: 12 },
        { id: uuidv4(), name: "Biology - Human Body", maxPoints: 25, weight: 2, requiredPoints: 14 },
        { id: uuidv4(), name: "Computer Science - Basics", maxPoints: 40, weight: 3, requiredPoints: 20 },
      ];

      const grades: Grade[] = [
        { studentId: students[0].id, testId: tests[0].id, points: 15 },
        { studentId: students[0].id, testId: tests[1].id, points: 10 },
        { studentId: students[0].id, testId: tests[2].id, points: 20 },
        { studentId: students[0].id, testId: tests[3].id, points: 16 },
        { studentId: students[0].id, testId: tests[4].id, points: 16 },
        { studentId: students[0].id, testId: tests[5].id, points: 17 },
        { studentId: students[0].id, testId: tests[6].id, points: 32 },

        { studentId: students[1].id, testId: tests[0].id, points: 18 },
        { studentId: students[1].id, testId: tests[2].id, points: 20 },
        { studentId: students[1].id, testId: tests[5].id, points: 19 },

        { studentId: students[2].id, testId: tests[3].id, points: 25 },
        { studentId: students[2].id, testId: tests[6].id, points: 30 },

        { studentId: students[3].id, testId: tests[0].id, points: 12 },
        { studentId: students[3].id, testId: tests[1].id, points: 14 },

        { studentId: students[4].id, testId: tests[1].id, points: 14 },
        { studentId: students[4].id, testId: tests[2].id, points: 21 },

        { studentId: students[5].id, testId: tests[2].id, points: 22 },
        { studentId: students[5].id, testId: tests[4].id, points: 15 },

        { studentId: students[6].id, testId: tests[3].id, points: 28 },
        { studentId: students[6].id, testId: tests[6].id, points: 35 },

        { studentId: students[7].id, testId: tests[0].id, points: 16 },
        { studentId: students[7].id, testId: tests[5].id, points: 20 },
      ];

      await db.students.bulkAdd(students);
      await db.tests.bulkAdd(tests);
      await db.grades.bulkAdd(grades);
    });
  }

  // ========== Students ==========
  async getAllStudents(): Promise<Student[]> {
    return this.students.toArray();
  }

  async addStudent(student: Student): Promise<string> {
    return this.students.add(student);
  }

  async updateStudent(
    studentId: string,
    updatedFields: Partial<Omit<Student, "id">>
  ): Promise<number> {
    return this.students.update(studentId, updatedFields);
  }

  async deleteStudentAndGrades(studentId: string): Promise<void> {
    await this.transaction("rw", this.students, this.grades, async () => {
      await this.grades.where("studentId").equals(studentId).delete();
      await this.students.delete(studentId);
    });
  }

  // =========== Tests ============
  async getAllTests(): Promise<Test[]> {
    return this.tests.toArray();
  }

  async addTest(test: Test): Promise<string> {
    return this.tests.add(test);
  }

  async updateTest(
    testId: string,
    updatedFields: Partial<Omit<Test, "id">>
  ): Promise<number> {
    return this.tests.update(testId, updatedFields);
  }

  async deleteTestAndGrades(testId: string): Promise<void> {
    await this.transaction("rw", this.tests, this.grades, async () => {
      await this.grades.where("testId").equals(testId).delete();
      await this.tests.delete(testId);
    });
  }

  // ========== Grades ============
  async getAllGrades(): Promise<Grade[]> {
    return this.grades.toArray();
  }

  async addGrade(grade: Grade): Promise<string> {
    return this.grades.add(grade);
  }

  async updateGrade(
    testId: string,
    studentId: string,
    updatedFields: Partial<Omit<Grade, "testId" | "studentId">>
  ): Promise<number> {
    return this.grades.update([studentId, testId], { ...updatedFields });
  }

  async deleteGrade(studentId: string, testId: string): Promise<void> {
    return this.grades.delete([studentId, testId]);
  }

  // ====== Grade Thresholds =======

  async initGradeThresholds(): Promise<void> {
    const count = await this.thresholds.count();
    if (count === 0) {
      const defaultThresholds: GradeThreshold[] = [
        { id: uuidv4(), name: "5", minPercentage: 90 },
        { id: uuidv4(), name: "4.5", minPercentage: 80 },
        { id: uuidv4(), name: "4", minPercentage: 70 },
        { id: uuidv4(), name: "3.5", minPercentage: 60 },
        { id: uuidv4(), name: "3", minPercentage: 50 },
        { id: uuidv4(), name: "2", minPercentage: 0 },
      ];
      await this.thresholds.bulkAdd(defaultThresholds);
    }
  }

  async getGradeThresholds(): Promise<GradeThreshold[]> {
    return this.thresholds.toArray();
  }

  async addGradeThreshold(threshold: GradeThreshold): Promise<string> {
    return this.thresholds.add(threshold);
  }

  async updateGradeThreshold(
    id: string,
    updatedFields: Partial<Omit<GradeThreshold, "id">>
  ): Promise<number> {
    return this.thresholds.update(id, updatedFields);
  }

  async deleteGradeThreshold(id: string): Promise<void> {
    return this.thresholds.delete(id);
  }

  async replaceGradeThresholds(newThresholds: GradeThreshold[]): Promise<void> {
    await this.transaction("rw", this.thresholds, async () => {
      await this.thresholds.clear();
      await this.thresholds.bulkAdd(newThresholds);
    });
  }
  // ========= Settings ==========

  async initSettings(): Promise<void> {
    const existing = await this.settings.get("global");
    if (!existing) {
      await this.settings.add({
        id: "global",
        editWithDialog: false,
      });
    }
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings.get("global");
  }

  async updateSettings(
    updatedFields: Partial<Omit<Settings, "id">>
  ): Promise<number> {
    return this.settings.update("global", updatedFields);
  }
}

export const db = new Database();
