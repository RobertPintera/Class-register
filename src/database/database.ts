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
    }

    async addStudent(student: Student){
        return this.students.add(student);
    }

    async getAllStudents() {
        return this.students.toArray();
    }

    async addGrade(grade: Grade) {
        return this.grades.add(grade);
    }

    async getGradesByStudentId(studentId: string) {
        return this.grades.where('studentId').equals(studentId).toArray();
    }
}

export const db = new Database();