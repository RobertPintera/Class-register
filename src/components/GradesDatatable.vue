<script setup lang="ts">
  import type { StudentGrades } from '@/models/StudentGrades';
  import type { Student } from '@/models/Student';
  import type { Grade } from '@/models/Grade';
  import type { Test } from '@/models/Test';
  import { computed, ref } from 'vue'


  const tests = ref<Test[]>([
    { id: 't1', name: 'Test 1', maxScore: 100 },
    { id: 't2', name: 'Test 2', maxScore: 50 }
  ]);

  const students = ref<Student[]>([
  { id: 's1', name: 'Anna', surname: 'Nowak' },
  { id: 's2', name: 'Jan', surname: 'Kowalski' },
  { id: 's3', name: 'Zofia', surname: 'Wiśniewska' }
  ])

  const grades = ref<Grade[]>([
    { studentId: 's1', testId: 't1', score: 95 },
    { studentId: 's1', testId: 't2', score: 45 },
    { studentId: 's2', testId: 't1', score: 80 },
    { studentId: 's2', testId: 't2', score: 40 }
  ]);

  const testColumns = computed(() =>
    tests.value.map(test => ({
      field: test.id,
      header: test.name
    }))
  );

  const studentGrades = computed(() => {
    return students.value.map(student => {
      const row: StudentGrades = {
        fullName: `${student.name} ${student.surname}`
      };

      for (const test of tests.value) {
        const grade = grades.value.find(
          g => g.studentId === student.id && g.testId === test.id
        );
        row[test.id] = grade ? grade.score : '-';
      }

      return row;
    }
  );
});
</script>
    
<template>
   <DataTable :value="studentGrades" tableStyle="min-width: 50rem">
    <Column field="fullName" header="Student" />
    <Column
      v-for="col in testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
    />
  </DataTable>
</template>