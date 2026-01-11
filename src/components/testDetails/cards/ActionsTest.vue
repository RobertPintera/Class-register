<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import EditTestDialog from '../EditTestDialog.vue';
import { reactive, ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useRouter } from 'vue-router';
import ChangeGradesDialog from '../ChangeGradesDialog.vue';
import type { Test } from '@/models/Test';

const testsStore = useTestsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const props = defineProps<{testId: string, maxPoints: number}>();
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
        await testsStore.deleteTest(props.testId);
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

  if(editedTest.maxPoints !== props.maxPoints) {
    showChangeGradesDialog.value = true;
  } else {
    testsStore.updateTest(props.testId, editedTest);
    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Successfully edited test', 
      life: 3000 
    });
  }
};

</script>

<template>
   <Card>
    <template #header>
      <h3>Actions</h3>
    </template>
    <template #body>
      <div class="flex flex-wrap justify-evenly pb-6">
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Edit test data</h4>
          <Button label="Edit" icon="pi pi-file-edit" class="w-28" @click="showEditTestDialog = true"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Delete test</h4>
          <Button label="Delete" icon="pi pi pi-times-circle" severity="danger" class="w-28" @click="loadDeleteTestDialog()"/>
        </div>
      </div>
      <EditTestDialog :test-id="testId" v-model:visible="showEditTestDialog" @submit="submitEditTestDialog"/>
      <ChangeGradesDialog :test-id="testId" :editedTest v-model:visible="showChangeGradesDialog"/>
    </template>
  </Card>
</template>