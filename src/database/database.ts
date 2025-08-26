import Dexie from "dexie";
import type { Table } from "dexie";
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
}

export const db = new Database();
