<script setup lang="ts">
  import GradesDatatable from '@/components/GradesDatatable.vue';
  import AddStudentView from '@/components/AddStudentView.vue';
  import { ref } from 'vue';
  import AddTestView from '@/components/AddTestView.vue';

  const showAddStudentDialog = ref<boolean>(false);
  const showAddTestDialog = ref<boolean>(false);
</script>

<template>
  <ButtonGroup class="m-10">
    <Button label="Add student" icon="pi pi-user-plus" @click="showAddStudentDialog = true"/>
    <Button label="Add test" icon="pi pi-book" @click="showAddTestDialog = true"/>
  </ButtonGroup>
  
  <div class="flex justify-center">
    <GradesDatatable />
  </div>

  <div class="m-10 flex justify-end">
    <ButtonGroup>
      <Button label="Export" icon="pi pi-file-export" />
      <Button label="Import" icon="pi pi-file-import" />
    </ButtonGroup>
  </div>

  <AddStudentView v-model:visible="showAddStudentDialog" />
  <AddTestView v-model:visible="showAddTestDialog"/>
</template>

<style scoped>

</style>
