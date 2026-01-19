<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import EditTestDialog from '../EditTestDialog.vue';
import { reactive, ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useRouter } from 'vue-router';
import ChangeGradesDialog from '../ChangeGradesDialog.vue';
import type { Test } from '@/models/Test';
import type { PassRate } from '@/models/PassRate';
import type { StudentResult } from '@/models/StudentResult';
import type { TestReport } from '@/models/TestReport';
import type { PerformanceStats } from '@/models/PerformanceStats';
import { pdfService } from '@/services/pdfService';

const testsStore = useTestsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const props = defineProps<{test: Test, performance: PerformanceStats, malePerformance: PerformanceStats, femalePerformace: PerformanceStats,
  passRate: PassRate, results: StudentResult[]}>();
const showEditTestDialog = ref<boolean>(false);
const showChangeGradesDialog = ref<boolean>(false);

const editedTest = reactive<Omit<Test, 'id'>>({
  name: '',
  maxPoints: 1,
  weight: 0,
  requiredPoints: null,
  isMandatory: false
});

const loadDeleteTestDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? The test will be deleted.',
    header: 'Delete test',
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
        await testsStore.deleteTest(props.test.id);
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Successfully deleted test', 
          life: 3000 
        });
        router.push('/main/tests');
      } catch (err) {
        toast.add({ 
          severity: 'danger', 
          summary: 'Error', 
          detail: 'Failed to delete test', 
          life: 3000 
        });
      }
    },
  });
};

const submitEditTestDialog = (data: Omit<Test, 'id'>) => {
  Object.assign(editedTest, data);
  showEditTestDialog.value = false;

  if(editedTest.maxPoints !== props.test.maxPoints) {
    showChangeGradesDialog.value = true;
  } else {
    testsStore.updateTest(props.test.id, editedTest);
    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Successfully edited test', 
      life: 3000 
    });
  }
};

const generateReport = async () => {
  const payload: TestReport = {
    test: props.test,
    performance: props.performance,
    malePerformance: props.malePerformance,
    femalePerformace: props.femalePerformace,
    passRate: props.passRate,
    results: props.results
  };

  await pdfService.generateTestReportPF(payload);
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
          <h4>Edit test data</h4>
          <Button label="Edit" icon="pi pi-file-edit" class="w-28" @click="showEditTestDialog = true"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Delete test</h4>
          <Button label="Delete" icon="pi pi pi-times-circle" severity="danger" class="w-28" @click="loadDeleteTestDialog()"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Generate report PDF</h4>
          <Button label="Report PDF" icon="pi pi pi-file-pdf" severity="info" @click="generateReport()"/>
        </div>
      </div>
      <EditTestDialog :test-id="props.test.id" v-model:visible="showEditTestDialog" @submit="submitEditTestDialog"/>
      <ChangeGradesDialog :test-id="props.test.id" :editedTest v-model:visible="showChangeGradesDialog"/>
    </template>
  </Card>
</template>