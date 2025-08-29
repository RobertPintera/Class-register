<script setup lang="ts">
import { ref } from 'vue';
import { useConfirm, useToast } from 'primevue';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useRouter } from 'vue-router';
import Card from '@/components/core/Card.vue';
import EditPersonalDataDialog from '../EditPersonalDataDialog.vue';

const studentsStore = useStudentsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const props = defineProps<{studentId: string}>();
const showEditPersonalDataDialog = ref<boolean>(false);

const loadDeleteStudentDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? The student will be deleted.',
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
        await studentsStore.deleteStudent(props.studentId);
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Successfully deleted student', 
          life: 3000 
        });
        router.push('/students');
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

</script>

<template>
  <Card>
    <template #header>
      <h3>Actions</h3>
    </template>
    <template #body>
      <div class="flex flex-wrap justify-evenly pb-6">
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Edit student data</h4>
          <Button label="Edit" class="w-20" @click="showEditPersonalDataDialog = true"/>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h4>Delete student</h4>
          <Button label="Delete" severity="danger" class="w-20" @click="loadDeleteStudentDialog()"/>
        </div>
      </div>
      <EditPersonalDataDialog :studentId="studentId" v-model:visible="showEditPersonalDataDialog" />
    </template>
  </Card>
</template>