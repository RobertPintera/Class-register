<script setup lang="ts">
  import StudentsDatatable from '@/components/studentsList/StudentsDatatable.vue';
  import NewStudentDialog from '@/components/studentsList/NewStudentDialog.vue';
  import { ref } from 'vue';

  const showNewStudentDialog = ref<boolean>(false);
</script>

<template>
  <h2 class="m-4">Students</h2>
  <div class="card">
    <Button label="New" icon="pi pi-plus" @click="showNewStudentDialog = true"/>
    <StudentsDatatable/>
  </div>
  
  <NewStudentDialog v-model:visible="showNewStudentDialog" />
</template>