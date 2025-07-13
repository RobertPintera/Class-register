import { defineStore } from "pinia";
import type { Student } from "@/models/Student";
import type { Grade } from "@/models/Grade";
import { db } from "@/database/database";
import { computed, ref } from "vue";
import type { Test } from "@/models/Test";
import type { StudentGrades } from "@/models/StudentGrades";

export const useRegisterStore = defineStore('register', () => {
  const students = ref<Student[]>([]);
  const tests = ref<Test[]>([]);
  const grades = ref<Grade[]>([]);

  const loadData = async () => {
    students.value = await db.students.toArray();
    tests.value = await db.tests.toArray();
    grades.value = await db.grades.toArray();
  };

  const addStudent = async (student: Student) => {
    await db.students.add(student);
    students.value.push(student);
    await loadData();
  };

   const addTest = async (test: Test) => {
    await db.tests.add(test);
    tests.value.push(test);
  };

  const addGrade = async (grade: Grade) => {
    await db.grades.put(grade);
    const existing = grades.value.find(g => g.studentId === grade.studentId && g.testId === grade.testId);
    if (existing) {
      existing.score = grade.score;
    } else {
      grades.value.push(grade);
    }
  };

  const testColumns = computed(() =>
    tests.value.map(test => ({
      field: test.id,
      header: test.name,
    }))
  );

  const studentGrades = computed<StudentGrades[]>(() =>
    students.value.map(student => {
      const row: StudentGrades = {
        fullName: `${student.name} ${student.surname}`,
      };

      for (const test of tests.value) {
        const grade = grades.value.find(
          g => g.studentId === student.id && g.testId === test.id
        );
        row[test.id] = grade ? grade.score : '-';
      }

      return row;
    })
  );

  loadData();

  return {
    students, tests, grades, testColumns, studentGrades,
    addStudent, addTest, addGrade,
    loadData
  };
});