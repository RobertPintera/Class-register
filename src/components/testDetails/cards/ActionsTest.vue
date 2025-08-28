<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import EditTestDialog from '../EditTestDialog.vue';
import { ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useRouter } from 'vue-router';

const testsStore = useTestsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const props = defineProps<{testId: string}>();
const showEditTestDialog = ref<boolean>(false);

const loadDeleteTestDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? The test will be deleted.',
    header: 'Delete test',
    icon: 'pi pi-times-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      severity: 'danger',
      label: 'Delete'
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
        router.push('/tests');
      } catch (err) {
        toast.add({ 
          severity: 'danger', 
          summary: 'Error', 
          detail: 'Failed to load demo data', 
          life: 3000 
        });
      }
    },
  });
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
          <h4>Edit Info Data</h4>
          <Button label="Edit" class="w-20" @click="showEditTestDialog = true"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Delete Test</h4>
          <Button label="Delete" severity="danger" class="w-20" @click="loadDeleteTestDialog()"/>
        </div>
      </div>
      <EditTestDialog :test-id="testId" v-model:visible="showEditTestDialog"/>
    </template>
  </Card>
</template>