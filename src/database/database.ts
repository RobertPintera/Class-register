import Dexie from "dexie";
import type { Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
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

    constructor(){
        super('Database');

        this.version(1).stores({
            students: 'id',
            tests: 'id',
            grades: '[studentId+testId], studentId, testId',
            thresholds: 'id',
            settings: 'id' 
        });

        this.students = this.table('students');
        this.tests = this.table('tests');
        this.grades = this.table('grades');
        this.thresholds = this.table('thresholds');
        this.settings = this.table('settings');
    };

    // ========== Students ==========
    async getAllStudents(): Promise<Student[]> {
        return this.students.toArray();
    };

    async addStudent(student: Student): Promise<string>{
        return this.students.add(student);
    }

    async updateStudent(studentId: string, updatedFields: Partial<Omit<Student, 'id'>>): Promise<number>{
         return this.students.update(studentId, updatedFields);
    }

    async deleteStudentAndGrades(studentId: string): Promise<void> {
        await this.transaction('rw', this.students, this.grades, async () => {
            await this.grades.where('studentId').equals(studentId).delete();
            await this.students.delete(studentId);
        });
    }

    // =========== Tests ============
    async getAllTests(): Promise<Test[]>{
        return this.tests.toArray();
    }

    async addTest(test: Test): Promise<string>{
        return this.tests.add(test);
    }

    async updateTest(testId: string, updatedFields: Partial<Omit<Test, 'id'>>): Promise<number> {
        return this.tests.update(testId, updatedFields);
    }

    async deleteTestAndGrades(testId: string): Promise<void> {
        await this.transaction('rw', this.tests, this.grades, async () => {
            await this.grades.where('testId').equals(testId).delete();
            await this.tests.delete(testId);
        });
    }

    // ========== Grades ============
    async getAllGrades(): Promise<Grade[]>{
        return this.grades.toArray();
    }
    
    async addGrade(grade: Grade): Promise<string>{
        return this.grades.add(grade);
    }

    async updateGrade(testId: string, studentId: string, updatedFields: Partial<Omit<Grade, 'testId' | 'studentId'>>): Promise<number>{
        return this.grades.update([studentId, testId], {...updatedFields});
    }

    async deleteGrade(studentId: string, testId: string): Promise<void> {
        return this.grades.delete([studentId, testId]);
    }

    // ====== Grade Thresholds =======

    async initGradeThresholds(): Promise<void> {
        const count = await this.thresholds.count();
        if (count === 0) {
            const defaultThresholds: GradeThreshold[] = [
            { id: uuidv4(), grade: "5", minPercentage: 90 },
            { id: uuidv4(), grade: "4.5", minPercentage: 80 },
            { id: uuidv4(), grade: "4", minPercentage: 70 },
            { id: uuidv4(), grade: "3.5", minPercentage: 60 },
            { id: uuidv4(), grade: "3", minPercentage: 50 },
            { id: uuidv4(), grade: "2", minPercentage: 0 },
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

    async updateGradeThreshold(id: string, updatedFields: Partial<Omit<GradeThreshold, 'id'>>): Promise<number> {
        return this.thresholds.update(id, updatedFields);
    }

    async deleteGradeThreshold(id: string): Promise<void>  {
        return this.thresholds.delete(id);
    }

    async replaceGradeThresholds(newThresholds: GradeThreshold[]): Promise<void> {
        await this.transaction('rw', this.thresholds, async () => {
            await this.thresholds.clear();
            await this.thresholds.bulkAdd(newThresholds);
        });
    }
    // ========= Settings ==========

    async initSettings(): Promise<void> {
        const existing = await this.settings.get('global');
        if (!existing) {
            await this.settings.add({
                id: 'global',
                editWithDialog: false
            });
        }
    }

    async getSettings(): Promise<Settings | undefined> {
        return this.settings.get('global');
    }

    async updateSettings(updatedFields: Partial<Omit<Settings, 'id'>>): Promise<number> {
        return this.settings.update('global', updatedFields);
    }
}

export const db = new Database();