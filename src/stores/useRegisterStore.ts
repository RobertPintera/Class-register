import { defineStore } from "pinia";
import type { Student } from "@/models/Student";
import type { Grade } from "@/models/Grade";
import { db } from "@/database/database";
import { computed, ref } from "vue";
import type { Test } from "@/models/Test";
import type { StudentGrades } from "@/models/StudentGrades";
import { v4 as uuidv4 } from 'uuid';

export const useRegisterStore = defineStore('register', () => {
  const students = ref<Student[]>([]);
  const tests = ref<Test[]>([]);
  const grades = ref<Grade[]>([]);

  const loadData = async () => {
    students.value = await db.getAllStudents();
    tests.value = await db.getAllTests();
    grades.value = await db.getAllGrades();
  };

  // ========== Students ==========
  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent: Student = { id: uuidv4(), ...student};
    await db.addStudent(newStudent);
    students.value.push(newStudent);
  };

  const updateStudent = async (id: string, updated: Partial<Omit<Student, 'id'>>) => {
    await db.updateStudent(id, updated);
    const index = students.value.findIndex(s => s.id === id);
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...updated };
    }
  };

  const deleteStudent = async (studentId: string) => {
    await db.deleteStudentAndGrades(studentId);
    students.value = students.value.filter(s => s.id !== studentId);
    grades.value = grades.value.filter(g => g.studentId !== studentId);
  };

  const getStudent = (studentId: string) => {
    return students.value.find(s => s.id === studentId);
  };

  // ============ Tests ============

  const addTest = async (test: Omit<Test, 'id'>) => {
    const newTest: Test = { id: uuidv4(), ...test };
    await db.addTest(newTest);
    tests.value.push(newTest);
  };

  const updateTest = async (id: string, updated: Partial<Omit<Test, 'id'>>) => {
    await db.updateTest(id, updated);
    const index = tests.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tests.value[index] = { ...tests.value[index], ...updated };
    }
  };

  const deleteTest = async (testId: string) => {
    await db.deleteTestAndGrades(testId);
    tests.value = tests.value.filter(t => t.id !== testId);
    grades.value = grades.value.filter(g => g.testId !== testId);
  };

  const getTest = (testId: string): Test | undefined => {
    return tests.value.find(t => t.id === testId);
  };

  // ============ Grades =========

  const updateGrade = async (grade: Grade) => {
    const updatedGrade: Grade = { ...grade };
    const existingGrade = grades.value.find(g => g.studentId === updatedGrade.studentId && g.testId === updatedGrade.testId);
    if (existingGrade) {
      existingGrade.score = updatedGrade.score;
      await db.updateGrade(existingGrade.testId, existingGrade.studentId, {score: existingGrade.score});
    } else {
      grades.value.push(updatedGrade);
      await db.addGrade(updatedGrade);
    }
  };

  const deleteGrade = async (studentId: string, testId: string) => {
    await db.deleteGrade(studentId, testId);
    grades.value = grades.value.filter(
      g => !(g.studentId === studentId && g.testId === testId)
    );
  };

  const getGrade = (studentId: string, testId: string): Grade | undefined => {
    return grades.value.find(
      g => g.studentId === studentId && g.testId === testId
    );
  };

  // ========== Computed ============
  const testColumns = computed(() =>
    tests.value.map(test => ({
      field: test.id,
      header: test.name,
    }))
  );

  const studentGrades = computed<StudentGrades[]>(() =>
    students.value.map(student => {
      const row: StudentGrades = {
        studentId: student.id,
        fullName: `${student.name} ${student.surname}`,
      };

      for (const test of tests.value) {
        const grade = grades.value.find(
          g => g.studentId === student.id && g.testId === test.id
        );
        row[test.id] = grade ? grade.score : -1;
      }

      return row;
    })
  );

  loadData();

  return {
    students, tests, grades,
    testColumns, studentGrades,
    loadData,
    addStudent, updateStudent, deleteStudent, getStudent,
    addTest, updateTest, deleteTest, getTest,
    updateGrade, deleteGrade, getGrade
  };
});