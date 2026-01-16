<script setup lang="ts">
import { ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useRouter } from 'vue-router';
import Card from '@/components/core/Card.vue';
import EditPersonalDataDialog from '../EditPersonalDataDialog.vue';
import type { Student } from '@/models/Student';
import type { StudentReport } from '@/models/StudentReport';
import type { Performance } from '@/models/Performance';
import type { GradeThreshold } from '@/models/GradeThreshold';
import type { GradeStats } from '@/models/GradeStats';
import type { StudentResult } from '@/models/TestResult';
import { generateStudentReportPDF } from '@/utility/pdfUtils';

const studentsStore = useStudentsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const props = defineProps<{student: Student, finalGrade: GradeThreshold, gradesStats: GradeStats, individualPerformance: Performance, classPerformance: Performance, results: StudentResult[]}>();
const showEditPersonalDataDialog = ref<boolean>(false);

const loadDeleteStudentDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? The student will be deleted.',
    header: 'Delete student',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      severity: 'secondary',
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true
    },
    acceptProps: {
      severity: 'danger',
      label: 'Delete',
      icon: 'pi pi-times-circle'
    },
    accept: async () => {
      try {
        await studentsStore.deleteStudent(props.student.id);
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Successfully deleted student', 
          life: 3000 
        });
        router.push('/main/students');
      } catch (err) {
        toast.add({ 
          severity: 'danger', 
          summary: 'Error', 
          detail: 'Failed to delete student', 
          life: 3000 
        });
      }
    },
  });
};

const generateReport = async () => {
  const payload: StudentReport = {
    student: props.student,
    finalGrade: props.finalGrade,
    gradesStats: props.gradesStats,
    individualPerformance: props.individualPerformance,
    classPerformace: props.classPerformance,
    results: props.results
  };

  await generateStudentReportPDF(payload);
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Actions</h3>
    </template>
    <template #body>
      <div class="flex flex-wrap justify-evenly pb-6 gap-4">
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Edit student data</h4>
          <Button label="Edit" icon="pi pi-file-edit" class="w-28" @click="showEditPersonalDataDialog = true"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Delete student</h4>
          <Button label="Delete" icon="pi pi pi-times-circle" severity="danger" class="w-28" @click="loadDeleteStudentDialog()"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Generate report PDF</h4>
          <Button label="Report PDF" icon="pi pi pi-file-pdf" severity="info" @click="generateReport()"/>
        </div>
      </div>
      <EditPersonalDataDialog :studentId="student.id" v-model:visible="showEditPersonalDataDialog" />
    </template>
  </Card>
</template>