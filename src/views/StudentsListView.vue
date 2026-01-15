<script setup lang="ts">
import StudentsDatatable from '@/components/studentsList/StudentsDatatable.vue';
import NewStudentDialog from '@/components/studentsList/NewStudentDialog.vue';
import { ref } from 'vue';
import Card from '@/components/core/Card.vue';

const showNewStudentDialog = ref<boolean>(false);
</script>

<template>
  <h1 class="sr-only">Register - Students</h1>
  <h2 class="title-section">Students</h2>
  <div class="cards-section">
    <Card>
      <template #header>
        <h3>List of students</h3>
      </template>
      <template #body>
        <div class="mt-2 mb-4">
          <Button label="New" icon="pi pi-plus" @click="showNewStudentDialog = true"/>
        </div>
        <StudentsDatatable/>
      </template>
    </Card>
  </div>
  <NewStudentDialog v-model:visible="showNewStudentDialog" />
</template>