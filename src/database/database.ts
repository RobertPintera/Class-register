import Dexie from "dexie";
import type { Table } from 'dexie';

import type { Student } from "../models/Student";
import type { Test } from "../models/Test";
import type { Grade } from "../models/Grade";

export class Database extends Dexie {
    students: Table<Student>;
    tests: Table<Test>;
    grades: Table<Grade>;

    constructor(){
        super('Database');

        this.version(1).stores({
            students: 'id',
            tests: 'id',
            grades: '[studentId+testId], studentId, testId'
        });

        this.students = this.table('students');
        this.tests = this.table('tests');
        this.grades = this.table('grades');
    };

    // ========== Students ==========
    async getAllStudents() {
        return this.students.toArray();
    };

    async addStudent(student: Student){
        return this.students.add(student);
    }

    async updateStudent(studentId: string, updatedFields: Partial<Omit<Student, 'id'>>){
         return this.students.update(studentId, updatedFields);
    }

    async deleteStudentAndGrades(studentId: string) {
        await this.transaction('rw', this.students, this.grades, async () => {
            await this.grades.where('studentId').equals(studentId).delete();
            await this.students.delete(studentId);
        });
    }

    // =========== Tests ============
    async getAllTests(){
        return this.tests.toArray();
    }

    async addTest(test: Test){
        return this.tests.add(test);
    }

    async updateTest(testId: string, updatedFields: Partial<Omit<Test, 'id'>>){
        return this.tests.update(testId, updatedFields);
    }

    async deleteTestAndGrades(testId: string) {
        await this.transaction('rw', this.tests, this.grades, async () => {
            await this.grades.where('testId').equals(testId).delete();
            await this.tests.delete(testId);
        });
    }

    // ========== Grades ============
    async getAllGrades(){
        return this.grades.toArray();
    }
    
    async addGrade(grade: Grade){
        return this.grades.add(grade);
    }

    async updateGrade(testId: string, studentId: string, updatedFields: Partial<Omit<Grade, 'testId' | 'studentId'>>){
        return this.grades.update([studentId, testId], {...updatedFields});
    }

    async deleteGrade(studentId: string, testId: string) {
        return this.grades.delete([studentId, testId]);
    }
}

export const db = new Database();